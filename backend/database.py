"""
In-memory database layer.
In a production system this would be replaced by a real database
(e.g. PostgreSQL with SQLAlchemy / async Tortoise ORM).
"""

from backend.schemas import DiagnosticRecord

# Simple dict acting as our in-memory store: record_id -> DiagnosticRecord
database: dict[str, DiagnosticRecord] = {}


def insert_record(record: DiagnosticRecord) -> DiagnosticRecord:
    """Persist a new diagnostic record."""
    database[record.record_id] = record
    return record


def get_record(record_id: str) -> DiagnosticRecord | None:
    """Fetch a single record by ID, or None if not found."""
    return database.get(record_id)


def get_all_records() -> list[DiagnosticRecord]:
    """Return all stored diagnostic records."""
    return list(database.values())


def update_record_outcome(record_id: str, outcome: int) -> DiagnosticRecord | None:
    """Update the clinical outcome for a record; returns updated record or None."""
    record = database.get(record_id)
    if record is None:
        return None
    record.clinical_outcome = outcome
    database[record_id] = record
    return record


def delete_record(record_id: str) -> bool:
    """Delete a record; returns True on success, False if not found."""
    if record_id not in database:
        return False
    del database[record_id]
    return True


def record_count() -> int:
    """Return total number of stored records."""
    return len(database)
