"""
CRUD API routes for the Explainable Cardiac Risk Diagnostic system.
All database interaction is delegated to the database module,
and all ML inference is delegated to the services module.
"""

import uuid
from fastapi import APIRouter, HTTPException

from backend import database as db
from backend.schemas import DiagnosticRecord, OutcomeUpdate, PatientVitals
from backend.services import run_inference

router = APIRouter(prefix="/diagnostics", tags=["Diagnostics"])


# ── CREATE ────────────────────────────────────────────────────────────────────
@router.post("/", response_model=DiagnosticRecord, status_code=201)
def create_assessment(vitals: PatientVitals):
    """
    Submit patient vitals → get a cardiac risk assessment with explainability scores.
    The record is persisted in the in-memory store.
    """
    risk_assessment, risk_probability, feature_importance = run_inference(vitals)

    record = DiagnosticRecord(
        record_id=str(uuid.uuid4()),
        vitals=vitals,
        risk_assessment=risk_assessment,
        risk_probability=risk_probability,
        feature_importance=feature_importance,
    )
    db.insert_record(record)
    return record


# ── READ (all) ────────────────────────────────────────────────────────────────
@router.get("/", response_model=list[DiagnosticRecord])
def get_all_assessments():
    """Return all stored diagnostic records."""
    return db.get_all_records()


# ── READ (single) ─────────────────────────────────────────────────────────────
@router.get("/{record_id}", response_model=DiagnosticRecord)
def get_assessment(record_id: str):
    """Fetch a single patient's diagnostic record by its UUID."""
    record = db.get_record(record_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Record not found")
    return record


# ── UPDATE ────────────────────────────────────────────────────────────────────
@router.put("/{record_id}", response_model=DiagnosticRecord)
def update_clinical_outcome(record_id: str, body: OutcomeUpdate):
    """
    Allow a clinician to attach the verified clinical outcome to a record.
    0 = False Alarm  |  1 = Confirmed Cardiac Issue
    """
    updated = db.update_record_outcome(record_id, body.clinical_outcome)
    if updated is None:
        raise HTTPException(status_code=404, detail="Record not found")
    return updated


# ── DELETE ────────────────────────────────────────────────────────────────────
@router.delete("/{record_id}")
def delete_assessment(record_id: str):
    """Remove a diagnostic record (e.g., for GDPR / privacy compliance)."""
    success = db.delete_record(record_id)
    if not success:
        raise HTTPException(status_code=404, detail="Record not found")
    return {"message": "Record securely deleted", "record_id": record_id}
