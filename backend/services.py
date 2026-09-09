"""
Business logic / service layer.
Keeps the route handlers thin — all ML inference & explainability logic lives here.
"""

import pandas as pd

from backend.model_loader import get_model
from backend.schemas import PatientVitals

# The four features the model was trained on, in the exact order it expects.
FEATURE_NAMES = ["age", "blood_pressure", "cholesterol", "max_heart_rate"]


def _vitals_to_dataframe(vitals: PatientVitals) -> pd.DataFrame:
    """Convert a PatientVitals object to a single-row DataFrame."""
    return pd.DataFrame([{
        "age": vitals.age,
        "blood_pressure": vitals.blood_pressure,
        "cholesterol": vitals.cholesterol,
        "max_heart_rate": vitals.max_heart_rate,
    }])


def compute_feature_importance(vitals: PatientVitals) -> dict[str, float]:
    """
    Return a per-feature contribution score (coefficient × feature value).
    Handles both a bare LogisticRegression and an sklearn Pipeline.
    Values are rounded to 4 decimal places for readability.
    """
    from sklearn.pipeline import Pipeline

    model = get_model()
    input_values = [vitals.age, vitals.blood_pressure, vitals.cholesterol, vitals.max_heart_rate]

    # Support Pipeline objects (e.g. StandardScaler → LogisticRegression)
    if isinstance(model, Pipeline):
        classifier = model.named_steps["classifier"]
    else:
        classifier = model

    coefficients = classifier.coef_[0]

    importance = {
        feature: round(float(coef * value), 4)
        for feature, coef, value in zip(FEATURE_NAMES, coefficients, input_values)
    }
    return importance


def run_inference(vitals: PatientVitals) -> tuple[str, float, dict]:
    """
    Run the full ML inference pipeline.

    Returns
    -------
    risk_assessment : str
        "High Risk" or "Low Risk"
    risk_probability : float
        Probability of High Risk as a percentage (0–100), rounded to 2 dp.
    feature_importance : dict
        Per-feature contribution scores for explainability.
    """
    model = get_model()
    input_df = _vitals_to_dataframe(vitals)

    prediction = int(model.predict(input_df)[0])
    prob_score = float(model.predict_proba(input_df)[0][1])

    risk_assessment = "High Risk" if prediction == 1 else "Low Risk"
    risk_probability = round(prob_score * 100, 2)
    feature_importance = compute_feature_importance(vitals)

    return risk_assessment, risk_probability, feature_importance
