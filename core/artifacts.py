import pickle
import numpy as np
import pandas as pd
from pydantic import BaseModel, Field, conint, confloat
from typing import Optional


class PatientFeatures(BaseModel):
    Ancestry: conint(ge=0, le=1) # 0: Black, 1: European
    Age: confloat(ge=0, le=120)
    M_Spike: confloat(ge=0)
    sFLC_Ratio: confloat(gt=0)
    Creatinine: confloat(ge=0)
    
    class Config:
        extra = "forbid"

    def to_series(self):
        return pd.Series(self.dict())


class CoxBootstrapBundle:
    def __init__(
        self,
        real_model,
        bootstrap_models,
        times,
    ):
        self.real_model = real_model
        self.bootstrap_models = bootstrap_models
        self.times = np.asarray(times)

    def save(self, path: str):
        with open(path, "wb") as f:
            pickle.dump(self, f)

    @classmethod
    def load(cls, path: str):
        with open(path, "rb") as f:
            obj = pickle.load(f)

        if not isinstance(obj, cls):
            raise TypeError("Invalid model artifact")

        return obj

    def predict_cumulative_incidence(self, patient_features: PatientFeatures, alpha=0.05):

        # Point estimate
        surv_hat = self.real_model.predict_survival_function(
            patient_features.to_series(),
            times=self.times
        )
        cum_hat = 1.0 - surv_hat[0].values

        # Bootstrap
        boot_curves = []
        for m in self.bootstrap_models:
            s = m.predict_survival_function(
                patient_features.to_series(),
                times=self.times
            )
            boot_curves.append(1.0 - s.values.flatten())
        boot_curves = np.asarray(boot_curves)
        lower = np.percentile(boot_curves, 100 * alpha / 2, axis=0)
        upper = np.percentile(boot_curves, 100 * (1 - alpha / 2), axis=0)

        return {
            "times": self.times,
            "risk": cum_hat,
            "ci_lower": lower,
            "ci_upper": upper,
        }
