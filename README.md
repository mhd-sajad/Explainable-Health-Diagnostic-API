# Explainable Health Diagnostic API

A production-structured **FastAPI** backend that predicts **cardiac risk** from
patient vitals and explains every prediction using logistic regression coefficients.

---

## Project Structure

```
Explainable_Health_Diagnostic_API/
│
├── main.py                     # FastAPI app entry point
├── requirements.txt            # Python dependencies
│
├── backend/                    # Application layer
│   ├── __init__.py
│   ├── schemas.py              # Pydantic request/response models
│   ├── database.py             # In-memory CRUD store
│   ├── model_loader.py         # Model loading & caching
│   ├── services.py             # ML inference + explainability logic
│   └── routes.py               # CRUD API route handlers
│
├── model/                      # ML model layer
│   ├── __init__.py
│   ├── train.py                # Training script (run this first!)
│   └── artifacts/              # Generated files (gitignored)
│       ├── cardiac_model.joblib
│       └── training_metrics.json
│
└── frontend/                   # (Coming soon — HTML/CSS/JS dashboard)
```

---

## Quick Start

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Train the model
```bash
python model/train.py
```

### 3. Start the API
```bash
uvicorn main:app --reload
```

### 4. Explore the docs
- Swagger UI → http://127.0.0.1:8000/docs
- ReDoc      → http://127.0.0.1:8000/redoc

---

## API Endpoints

| Method   | Endpoint                    | Description                                  |
|----------|-----------------------------|----------------------------------------------|
| `POST`   | `/diagnostics/`             | Submit vitals → get risk assessment          |
| `GET`    | `/diagnostics/`             | List all diagnostic records                  |
| `GET`    | `/diagnostics/{record_id}`  | Get a single record                          |
| `PUT`    | `/diagnostics/{record_id}`  | Update clinical outcome (doctor verification)|
| `DELETE` | `/diagnostics/{record_id}`  | Delete a record (privacy/GDPR compliance)    |
| `GET`    | `/health`                   | API health check                             |

---

## Sample Request

```json
POST /diagnostics/
{
  "age": 62,
  "blood_pressure": 150,
  "cholesterol": 260,
  "max_heart_rate": 130
}
```

### Sample Response
```json
{
  "record_id": "a1b2c3d4-...",
  "vitals": { ... },
  "risk_assessment": "High Risk",
  "risk_probability": 87.43,
  "feature_importance": {
    "age": 1.2340,
    "blood_pressure": 0.9871,
    "cholesterol": 1.1042,
    "max_heart_rate": -0.8732
  },
  "clinical_outcome": null
}
```

---

## Model

- **Algorithm**: Logistic Regression (sklearn Pipeline with StandardScaler)
- **Features**: age, blood_pressure, cholesterol, max_heart_rate
- **Target**: cardiac_risk (0 = Low Risk, 1 = High Risk)
- **Explainability**: Coefficient × feature value contributions returned with every prediction
