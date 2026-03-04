import pickle
import numpy as np
import pandas as pd
from pydantic import BaseModel, conint, confloat
from typing import Optional


class PatientFeatures(BaseModel):
    age: confloat(ge=0, le=120)
    m_spike: confloat(ge=0)
    sflc_ratio: confloat(gt=0)
    creatinine: confloat(ge=0)
    pgs_bin: Optional[conint(ge=0, le=2)]
    
    class Config:
        extra = "forbid"

    def to_series(self):
        return pd.Series(self.dict())


class CoxBootstrapBundle:
    def __init__(
        self,
        real_model,
        bootstrap_models,
        feature_stats: Optional[dict] = None,
    ):
        self.real_model = real_model
        self.bootstrap_models = bootstrap_models
        # feature_stats: {feature_name: {"mean": float, "std": float}}
        # Features listed here are z-score standardized before prediction.
        self.feature_stats = feature_stats or {}

    def _standardize(self, s: pd.Series) -> pd.Series:
        if not self.feature_stats:
            return s
        s = s.copy()
        for feat, stats in self.feature_stats.items():
            if feat in s.index:
                s[feat] = (s[feat] - stats["mean"]) / stats["std"]
        return s

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

    def predict_cumulative_incidence(self, patient_features: PatientFeatures, alpha=0.05, max_time=10, samples=100):
        times = np.linspace(0, max_time, num=samples)

        scaled = self._standardize(patient_features.to_series())

        # Point estimate
        surv_hat = self.real_model.predict_survival_function(
            scaled,
            times=times
        )
        cum_hat = 1.0 - surv_hat[0].values

        # Bootstrap
        boot_curves = []
        for m in self.bootstrap_models:
            s = m.predict_survival_function(
                scaled,
                times=times
            )
            boot_curves.append(1.0 - s.values.flatten())
        boot_curves = np.asarray(boot_curves)
        lower = np.percentile(boot_curves, 100 * alpha / 2, axis=0)
        upper = np.percentile(boot_curves, 100 * (1 - alpha / 2), axis=0)

        return pd.DataFrame({
            "time": times,
            "risk": cum_hat,
            "ci_lower": lower,
            "ci_upper": upper,
        }).set_index("time")
