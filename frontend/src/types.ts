export interface PatientFeatures {
  Ancestry: number;
  Age: number;
  M_Spike: number;
  sFLC_Ratio: number;
  Creatinine: number;
}

export interface PredictionResponse {
  time: number[];
  risk: number[];
  ci_lower: number[];
  ci_upper: number[];
}
