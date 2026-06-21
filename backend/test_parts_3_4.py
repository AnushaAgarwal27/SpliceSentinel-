"""
TESTING PART 3 & 4

Tests patient similarity scorer and Claude integration.

Usage:
    python3 test_parts_3_4.py
"""

import asyncio
from services.openfda_service import check_drug_combination
from services.signal_detection import find_elevated_signals
from services.similarity_scorer import find_similar_cases
from services.claude_service import summarize_narrative_pattern, generate_clinical_note


async def test_full_pipeline():
    """Test PARTS 1-4 together."""
    print("\n" + "=" * 70)
    print("🔬 TESTING: Warfarin + Ibuprofen (PARTS 1-4)")
    print("=" * 70)

    # ========== PART 1: Get data ==========
    print("\n⏳ PART 1: Querying openFDA...")
    data = await check_drug_combination("Warfarin", "Ibuprofen")

    combo_total = data["combo_total"]
    combo_reports = data["combo_reports"]
    combo_reactions = data["combo_reactions"]
    drug_a_reactions = data["drug_a_reactions"]
    drug_a_total = data["drug_a_total"]
    drug_b_reactions = data["drug_b_reactions"]
    drug_b_total = data["drug_b_total"]

    print(f"✅ Found {combo_total} reports")

    # ========== PART 2: Calculate signals ==========
    print("\n🔍 PART 2: Finding signals...")
    signals = find_elevated_signals(
        combo_reactions, combo_total,
        drug_a_reactions, drug_a_total,
        drug_b_reactions, drug_b_total,
        prr_threshold=2.0
    )
    print(f"✅ Found {len(signals)} signals")
    if signals:
        print(f"   Top signal: {signals[0]['reaction']}")

    # ========== PART 3: Find similar cases ==========
    print("\n👥 PART 3: Finding similar patient cases...")

    # Create mock patient
    mock_patient = {
        "age": 67,
        "sex": "M",
        "conditions": ["atrial fibrillation", "hypertension"],
        "meds": ["Warfarin", "Metoprolol"]
    }

    print(f"   Patient: {mock_patient['age']}yo {mock_patient['sex']}, "
          f"conditions: {', '.join(mock_patient['conditions'])}, "
          f"meds: {', '.join(mock_patient['meds'])}")

    similar_cases = find_similar_cases(
        patient_age=mock_patient["age"],
        patient_sex=mock_patient["sex"],
        patient_conditions=mock_patient["conditions"],
        patient_current_meds=mock_patient["meds"],
        faers_reports=combo_reports,
        top_n=3,
        min_similarity=0.3
    )

    print(f"✅ Found {len(similar_cases)} similar cases:")
    for i, case in enumerate(similar_cases, 1):
        print(f"\n   Case {i}: {case['similarity_score']}% similar")
        print(f"   Reason: {case['reason']}")
        print(f"   Reaction: {case['reaction']}")
        print(f"   Report ID: {case['safetyreportid']}")

    # ========== PART 4: Claude summaries ==========
    if signals and combo_reports:
        print("\n📋 PART 4: Generating Claude summaries...")

        print("\n   A) Narrative Summary:")
        narrative = summarize_narrative_pattern(
            "Warfarin", "Ibuprofen", combo_reports, signals[0]["reaction"]
        )
        print(f"   {narrative[:300]}...")

        print("\n   B) Clinical Note:")
        note = generate_clinical_note(
            "Warfarin", "Ibuprofen", combo_total, signals, narrative,
            patient_age=mock_patient["age"],
            patient_sex=mock_patient["sex"],
            patient_conditions=mock_patient["conditions"]
        )
        print(f"   {note[:300]}...")

    print("\n" + "=" * 70)
    print("✅ Test complete!")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    asyncio.run(test_full_pipeline())
