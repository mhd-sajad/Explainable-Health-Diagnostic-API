"""
Pydantic schemas for request/response data validation.
All API input/output models are defined here.
"""

from pydantic import BaseModel, Field


class PatientVitals(BaseModel):
    """Input schema — patient vitals sent to the API."""
    age: int = Field(..., ge=18, le=110, description="Patient age")
    blood_pressure: int = Field(..., ge=70, le=250, description="Resting blood pressure (mmHg)")
    cholesterol: int = Field(..., ge=100, le=500, description="Serum cholesterol (mg/dl)")
    max_heart_rate: int = Field(..., ge=60, le=220, description="Maximum heart rate achieved")

    model_config = {
        "json_schema_extra": {
            "example": {
                "age": 55,
                "blood_pressure": 135,
                "cholesterol": 230,
                "max_heart_rate": 145
            }
        }
    }


class DiagnosticRecord(BaseModel):
    """Full diagnostic record stored and returned by the API."""
    record_id: str
    vitals: PatientVitals
    risk_assessment: str            # "High Risk" or "Low Risk"
    risk_probability: float         # Percentage probability of High Risk
    feature_importance: dict        # Explainability: contribution of each feature
    clinical_outcome: int | None = None  # 0 = False Alarm, 1 = Confirmed Issue


class OutcomeUpdate(BaseModel):
    """Schema for updating the clinical outcome of a record."""
    clinical_outcome: int = Field(..., ge=0, le=1, description="0 = False Alarm, 1 = Confirmed Issue")

    model_config = {
        "json_schema_extra": {
            "example": {
                "clinical_outcome": 1
            }
        }
    }


class HealthResponse(BaseModel):
    """Health-check response schema."""
    status: str
    model_loaded: bool
    total_records: int
