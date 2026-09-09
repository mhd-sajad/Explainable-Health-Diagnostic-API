"""
ML model loader — loads the trained cardiac risk model from disk.
Provides a singleton-style accessor used across the application.
"""

import os
import joblib
from sklearn.linear_model import LogisticRegression

# Resolve the path relative to the project root (one level up from backend/)
_MODEL_PATH = os.path.join(
    os.path.dirname(__file__), "..", "model", "artifacts", "cardiac_model.joblib"
)
_MODEL_PATH = os.path.abspath(_MODEL_PATH)

_model: LogisticRegression | None = None


def load_model() -> LogisticRegression:
    """
    Load the trained model from disk and cache it in memory.
    Raises FileNotFoundError if the model artifact does not exist.
    Run model/train.py first to generate it.
    """
    global _model
    if _model is None:
        if not os.path.exists(_MODEL_PATH):
            raise FileNotFoundError(
                f"Model artifact not found at '{_MODEL_PATH}'. "
                "Please run `python model/train.py` first."
            )
        _model = joblib.load(_MODEL_PATH)
    return _model


def get_model() -> LogisticRegression:
    """Return the cached model, loading it if necessary."""
    return load_model()


def is_model_loaded() -> bool:
    """Check whether the model has already been loaded into memory."""
    return _model is not None
