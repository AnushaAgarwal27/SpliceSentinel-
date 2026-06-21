"""
Drug Interaction Checker - FastAPI Backend

A hackathon tool for doctors to check if a drug combination is dangerous
for a specific patient, using real FDA adverse event data.

Architecture:
  PART 1: openFDA query service
  PART 2: Signal detection (PRR)
  PART 3: Patient similarity scorer
  PART 4: Claude narrative + note generation
  PART 5: Confidence handling
  PART 6: Arize Phoenix observability
  PART 7: FastAPI endpoints

Run:
  uvicorn app:app --reload --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os

from config import ANTHROPIC_API_KEY, HOST, PORT, PRR_THRESHOLD
from services.openfda_service import check_drug_combination
from services.signal_detection import find_elevated_signals, calculate_data_confidence
from services.similarity_scorer import find_similar_cases
from services.claude_service import summarize_narrative_pattern, generate_clinical_note

# Initialize Arize Phoenix tracing (PART 6)
try:
    import phoenix as px
    from openinference.instrumentation.anthropic import AnthropicInstrumentor

    px.launch_app()
    AnthropicInstrumentor().instrument()
    print("✅ Arize Phoenix initialized. Traces at http://localhost:6006")
except Exception as e:
    print(f"⚠️  Phoenix setup skipped: {e}")

# Initialize FastAPI app
app = FastAPI(
    title="Drug Interaction Checker",
    description="Real FDA adverse event data for drug combinations",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# Request/Response Models
# ============================================================================

class DrugCombinationRequest(BaseModel):
    """Input: Doctor's check request."""
    drug_a: str
    drug_b: str
    patient_age: Optional[int] = None
    patient_sex: Optional[str] = None  # "M", "F", or None
    patient_conditions: Optional[List[str]] = None
    patient_current_meds: Optional[List[str]] = None


class ReactionSignal(BaseModel):
    """A flagged reaction with PRR data."""
    reaction: str
    combo_count: int
    rate_in_combo: float
    prr_vs_drug_a: float
    prr_vs_drug_b: float


class SimilarCase(BaseModel):
    """A similar patient case from FAERS."""
    similarity_score: float
    reason: str
    reaction: str
    safetyreportid: str
    days_to_onset: Optional[int] = None
    case_age: Optional[int] = None
    case_sex: Optional[str] = None


class CheckResult(BaseModel):
    """Result of drug combination check (all PARTS combined)."""
    drug_a: str
    drug_b: str
    combo_total: int
    confidence: str
    confidence_message: str
    signals: List[ReactionSignal]
    similar_cases: List[SimilarCase] = []  # PART 3
    narrative_summary: str = ""  # PART 4
    clinical_note: str = ""  # PART 4


# ============================================================================
# Endpoints
# ============================================================================

@app.get("/health")
async def health():
    """Health check."""
    return {"status": "ok", "service": "drug-interaction-checker"}


@app.post("/api/check-combination")
async def check_combination(request: DrugCombinationRequest) -> CheckResult:
    """
    Main endpoint: Check if a drug combination is dangerous.

    PART 1: Query openFDA
    PART 2: Calculate PRR signal
    PART 3: Find similar patient cases
    PART 4: Claude narrative + note
    PART 5: Confidence assessment

    Returns all results combined.
    """
    if not request.drug_a or not request.drug_b:
        raise HTTPException(status_code=400, detail="Both drug_a and drug_b required")

    drug_a = request.drug_a.strip()
    drug_b = request.drug_b.strip()

    print(f"\n🔬 Checking: {drug_a} + {drug_b}")

    # ========== PART 1: Query openFDA ==========
    print(f"⏳ PART 1: Querying openFDA...")
    try:
        data = await check_drug_combination(drug_a, drug_b)
    except Exception as e:
        print(f"❌ Query failed: {e}")
        raise HTTPException(status_code=502, detail=f"openFDA query failed: {str(e)}")

    combo_total = data["combo_total"]
    combo_reports = data["combo_reports"]
    combo_reactions = data["combo_reactions"]
    drug_a_reactions = data["drug_a_reactions"]
    drug_a_total = data["drug_a_total"]
    drug_b_reactions = data["drug_b_reactions"]
    drug_b_total = data["drug_b_total"]

    print(f"✅ Found {combo_total} combination reports")

    # ========== PART 2: Calculate PRR signals ==========
    print(f"🔍 PART 2: Calculating PRR signals...")
    signals = find_elevated_signals(
        combo_reactions, combo_total,
        drug_a_reactions, drug_a_total,
        drug_b_reactions, drug_b_total,
        prr_threshold=PRR_THRESHOLD
    )
    print(f"✅ Found {len(signals)} elevated signals")

    # ========== PART 5: Data confidence assessment ==========
    confidence = calculate_data_confidence(combo_total)
    print(f"📈 Confidence: {confidence['level']}")

    # ========== PART 3: Find similar patient cases ==========
    print(f"👥 PART 3: Finding similar patient cases...")
    similar_cases = []
    try:
        similar_cases_data = find_similar_cases(
            patient_age=request.patient_age,
            patient_sex=request.patient_sex,
            patient_conditions=request.patient_conditions or [],
            patient_current_meds=request.patient_current_meds or [],
            faers_reports=combo_reports,
            top_n=5,
            min_similarity=0.3
        )
        similar_cases = [SimilarCase(**case) for case in similar_cases_data]
        print(f"✅ Found {len(similar_cases)} similar cases")
    except Exception as e:
        print(f"⚠️  Similarity scoring failed: {e}")

    # ========== PART 4: Claude narrative + note ==========
    narrative_summary = ""
    clinical_note = ""

    if signals and combo_reports:
        print(f"📋 PART 4: Generating Claude summaries...")
        try:
            narrative_summary = summarize_narrative_pattern(
                drug_a, drug_b, combo_reports, signals[0]["reaction"]
            )
            print(f"✅ Generated narrative summary")

            clinical_note = generate_clinical_note(
                drug_a, drug_b, combo_total, signals,
                narrative_summary,
                patient_age=request.patient_age,
                patient_sex=request.patient_sex,
                patient_conditions=request.patient_conditions
            )
            print(f"✅ Generated clinical note")
        except Exception as e:
            print(f"⚠️  Claude generation failed: {e}")
            narrative_summary = f"Could not generate summary: {str(e)}"
            clinical_note = f"Could not generate note: {str(e)}"

    # ========== Build final response ==========
    signal_objects = [ReactionSignal(**sig) for sig in signals]

    result = CheckResult(
        drug_a=drug_a,
        drug_b=drug_b,
        combo_total=combo_total,
        confidence=confidence["level"],
        confidence_message=confidence["message"],
        signals=signal_objects,
        similar_cases=similar_cases,
        narrative_summary=narrative_summary,
        clinical_note=clinical_note
    )

    print(f"✅ Check complete!\n")
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT)
