from core.artifacts import PatientFeatures, CoxBootstrapBundle
import pandas as pd
from lifelines import CoxPHFitter


TRAINING_DATA = 'data/myeloma_data.csv'
BOOTSTRAP_RUNS = 100
OUTPUT_PATH = 'models/cox_bootstrap_bundle.pkl'

# -----------------------
# Read training data
# -----------------------
df = pd.read_csv(TRAINING_DATA, index_col='ID')
df['Ancestry'] = df['Ancestry'].map({
    'European': 1,
    'African American': 0
})
# We use years since it's consistent with PANGEA charts
df['Time_Years'] = df['Time_Months'] / 12

# -----------------------
# Columns
# -----------------------
duration_col = 'Time_Years'
event_col = 'Status'
feature_cols = list(PatientFeatures.model_fields.keys())
cols = feature_cols + [duration_col, event_col]

# -----------------------
# Fit the real model
# -----------------------
real_model = CoxPHFitter()
real_model.fit(
    df[cols],
    duration_col=duration_col,
    event_col=event_col
)

# Fix the time grid from the real model
times = real_model.baseline_survival_.index.values

# -----------------------
# Fit bootstrap models
# -----------------------
bootstrap_models = []

for b in range(BOOTSTRAP_RUNS):
    boot_df = df.sample(frac=1.0, replace=True, random_state=b)

    cph = CoxPHFitter()
    cph.fit(
        boot_df[cols],
        duration_col=duration_col,
        event_col=event_col
    )

    bootstrap_models.append(cph)

# -----------------------
# Package artifacts
# -----------------------
bundle = CoxBootstrapBundle(real_model, bootstrap_models, times)
bundle.save(OUTPUT_PATH)
print(f"Saved {1 + BOOTSTRAP_RUNS} Cox models to {OUTPUT_PATH}")
