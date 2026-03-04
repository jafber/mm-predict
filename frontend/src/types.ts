export interface PatientFeatures {
  age: number;
  m_spike: number;
  sflc_ratio: number;
  creatinine: number;
  pgs_bin: number | null;
}

export interface PredictionResponse {
  time: number[];
  risk: number[];
  ci_lower: number[];
  ci_upper: number[];
}
