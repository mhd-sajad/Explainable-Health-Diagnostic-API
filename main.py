"""
FastAPI Application Entry Point
================================
Explainable Cardiac Risk Diagnostic API

Usage (from project root):
    uvicorn main:app --reload

Docs:
    http://127.0.0.1:8000/docs   ← Swagger UI
    http://127.0.0.1:8000/redoc  ← ReDoc
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.model_loader import load_model, is_model_loaded
from backend.routes import router as diagnostics_router
from backend import database as db


# ── Lifespan: load model once at startup ──────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the ML model when the server starts; release resources on shutdown."""
    print("🔄  Loading cardiac risk model...")
    load_model()
    print("✅  Model loaded and ready.")
    yield
    print("🛑  Shutting down — releasing resources.")


# ── Application Factory ───────────────────────────────────────────────────────
app = FastAPI(
    title="Explainable Cardiac Risk API",
    description=(
        "A RESTful CRUD API that predicts cardiac risk from patient vitals "
        "and provides transparent, coefficient-based explainability scores "
        "for every prediction."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS (ready for the future frontend) ──────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Restrict to your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(diagnostics_router)


# ── Health Check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["System"])
def health_check():
    """Quick liveness/readiness probe."""
    return {
        "status": "ok",
        "model_loaded": is_model_loaded(),
        "total_records": db.record_count(),
    }


# ── Root ─────────────────────────────────────────────────────────────────────
@app.get("/", tags=["System"])
def root():
    return {
        "message": "Welcome to the Explainable Cardiac Risk API",
        "docs": "/docs",
        "health": "/health",
    }

