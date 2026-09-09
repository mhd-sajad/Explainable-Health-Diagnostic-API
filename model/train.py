"""
train.py — Cardiac Risk Model Training Script
==============================================
Trains a Logistic Regression classifier on a synthetic cardiac dataset
and saves the trained artifact to model/artifacts/cardiac_model.joblib.

Run from the PROJECT ROOT:
    python model/train.py

The saved model is then auto-loaded by the FastAPI backend via backend/model_loader.py.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score,
)

# ── 1. Dataset ────────────────────────────────────────────────────────────────
# Synthetic cardiac patient data
# Features: age, resting blood pressure (mmHg), cholesterol (mg/dl), max heart rate
# Target  : cardiac_risk  (0 = Low Risk, 1 = High Risk)

data = {
    "age":            [45, 62, 35, 71, 50, 41, 68, 55, 30, 75,
                       48, 65, 38, 70, 52, 43, 66, 57, 33, 72],
    "blood_pressure": [120, 150, 115, 160, 130, 118, 145, 135, 110, 155,
                       125, 148, 112, 162, 128, 122, 143, 138, 108, 158],
    "cholesterol":    [200, 260, 180, 280, 220, 195, 250, 230, 175, 290,
                       205, 265, 178, 275, 215, 198, 248, 235, 172, 285],
    "max_heart_rate": [170, 130, 185, 115, 155, 175, 125, 145, 190, 110,
                       168, 132, 183, 118, 153, 172, 127, 142, 188, 113],
    "cardiac_risk":   [0, 1, 0, 1, 0, 0, 1, 1, 0, 1,
                       0, 1, 0, 1, 0, 0, 1, 1, 0, 1],
}

FEATURE_NAMES = ["age", "blood_pressure", "cholesterol", "max_heart_rate"]
TARGET = "cardiac_risk"

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "artifacts")
MODEL_PATH    = os.path.join(ARTIFACTS_DIR, "cardiac_model.joblib")
METRICS_PATH  = os.path.join(ARTIFACTS_DIR, "training_metrics.json")


# ── 2. Prepare Data ───────────────────────────────────────────────────────────
def prepare_data() -> tuple[pd.DataFrame, pd.Series]:
    df = pd.DataFrame(data)
    X = df[FEATURE_NAMES]
    y = df[TARGET]
    return X, y


# ── 3. Build Pipeline ─────────────────────────────────────────────────────────
def build_pipeline() -> Pipeline:
    """
    StandardScaler → LogisticRegression pipeline.
    Scaling is critical for Logistic Regression to converge properly and for
    coefficient magnitudes to be comparable (used for explainability).
    """
    return Pipeline([
        ("scaler", StandardScaler()),
        ("classifier", LogisticRegression(
            max_iter=1000,
            random_state=42,
            class_weight="balanced",   # handles class imbalance gracefully
        )),
    ])


# ── 4. Evaluate ───────────────────────────────────────────────────────────────
def evaluate(pipeline: Pipeline, X: pd.DataFrame, y: pd.Series) -> dict:
    """Run cross-validation and compute key classification metrics."""
    cv_scores = cross_val_score(pipeline, X, y, cv=5, scoring="roc_auc")

    # Fit on full data for final metrics (small dataset — no hold-out split needed)
    pipeline.fit(X, y)
    y_pred = pipeline.predict(X)
    y_prob = pipeline.predict_proba(X)[:, 1]

    metrics = {
        "cv_roc_auc_mean": round(float(cv_scores.mean()), 4),
        "cv_roc_auc_std":  round(float(cv_scores.std()), 4),
        "train_roc_auc":   round(float(roc_auc_score(y, y_prob)), 4),
        "confusion_matrix": confusion_matrix(y, y_pred).tolist(),
        "classification_report": classification_report(y, y_pred, output_dict=True),
    }
    return metrics


# ── 5. Explainability Summary ─────────────────────────────────────────────────
def print_feature_importance(pipeline: Pipeline) -> None:
    """Print the logistic regression coefficients as feature importance proxy."""
    classifier: LogisticRegression = pipeline.named_steps["classifier"]
    scaler: StandardScaler = pipeline.named_steps["scaler"]

    # Raw coefficients (on scaled features)
    coefs = classifier.coef_[0]
    # Effective coefficients in original feature space (coef / std)
    effective_coefs = coefs / scaler.scale_

    print("\n── Feature Importance (Logistic Regression Coefficients) ──")
    print(f"{'Feature':<20} {'Scaled Coef':>14} {'Effective Coef':>16}")
    print("─" * 52)
    for feat, sc, ec in zip(FEATURE_NAMES, coefs, effective_coefs):
        print(f"{feat:<20} {sc:>14.4f} {ec:>16.4f}")
    print()


# ── 6. Save Artifacts ─────────────────────────────────────────────────────────
def save_artifacts(pipeline: Pipeline, metrics: dict) -> None:
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)

    joblib.dump(pipeline, MODEL_PATH)
    print(f"✅  Model saved   → {MODEL_PATH}")

    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"✅  Metrics saved → {METRICS_PATH}")


# ── 7. Main ───────────────────────────────────────────────────────────────────
def main() -> None:
    print("=" * 60)
    print("  Explainable Cardiac Risk — Model Training")
    print("=" * 60)

    X, y = prepare_data()
    print(f"\nDataset: {len(X)} samples | {len(FEATURE_NAMES)} features | target='{TARGET}'")
    print(f"Class distribution:\n{y.value_counts().to_string()}\n")

    pipeline = build_pipeline()
    metrics  = evaluate(pipeline, X, y)

    print("── Cross-Validation Results (ROC-AUC, 5-fold) ──")
    print(f"  Mean: {metrics['cv_roc_auc_mean']:.4f}  ±  {metrics['cv_roc_auc_std']:.4f}")
    print(f"  Train ROC-AUC: {metrics['train_roc_auc']:.4f}")

    print("\n── Classification Report ──")
    report = metrics["classification_report"]
    for label, vals in report.items():
        if isinstance(vals, dict):
            print(f"  Class {label}: precision={vals['precision']:.2f}  "
                  f"recall={vals['recall']:.2f}  f1={vals['f1-score']:.2f}")

    print_feature_importance(pipeline)
    save_artifacts(pipeline, metrics)

    print("\n🚀  Training complete. Start the API with:")
    print("      uvicorn main:app --reload")


if __name__ == "__main__":
    main()
