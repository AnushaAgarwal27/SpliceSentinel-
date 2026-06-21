"""
TESTING PARTS 1-3 (No Claude needed)

Tests:
- PART 1: openFDA queries
- PART 2: PRR signal detection
- PART 3: Patient similarity scoring

Usage:
    python3 test_parts_1_to_3.py
"""

import asyncio
from services.openfda_service import check_drug_combination
from services.signal_detection import find_elevated_signals
from services.similarity_scorer import find_similar_cases


async def test_parts_1_to_3():
    """Test PARTS 1-3 (no Claude needed)."""
    print("\n" + "=" * 80)
    print("🔬 TESTING: Warfarin + Ibuprofen (PARTS 1-3)")
    print("=" * 80)

    # ========== PART 1: Query openFDA ==========
    print("\n📊 PART 1: Querying FDA Adverse Event Database")
    print("-" * 80)
    data = await check_drug_combination("Warfarin", "Ibuprofen")

    combo_total = data["combo_total"]
    combo_reports = data["combo_reports"]
    combo_reactions = data["combo_reactions"]
    drug_a_reactions = data["drug_a_reactions"]
    drug_a_total = data["drug_a_total"]
    drug_b_reactions = data["drug_b_reactions"]
    drug_b_total = data["drug_b_total"]

    print(f"✅ Query Results:")
    print(f"   Warfarin + Ibuprofen together: {combo_total:,} reports")
    print(f"   Warfarin alone: {drug_a_total:,} reports")
    print(f"   Ibuprofen alone: {drug_b_total:,} reports")
    print(f"\n   Sample reactions in combo:")
    for reaction, count in list(combo_reactions.items())[:5]:
        print(f"      • {reaction}: {count} reports")

    # ========== PART 2: Calculate PRR signals ==========
    print("\n\n📈 PART 2: Signal Detection (PRR Analysis)")
    print("-" * 80)
    signals = find_elevated_signals(
        combo_reactions, combo_total,
        drug_a_reactions, drug_a_total,
        drug_b_reactions, drug_b_total,
        prr_threshold=2.0
    )

    print(f"✅ Found {len(signals)} elevated signals (PRR >= 2.0)")
    print(f"\n   What is PRR?")
    print(f"   PRR = How much more common is this reaction in the combo?")
    print(f"   E.g., PRR=5 means 5x more common when taking both drugs")
    print(f"\n   Top 5 Most Concerning Reactions:")
    for i, signal in enumerate(signals[:5], 1):
        print(f"\n   {i}. {signal['reaction']}")
        print(f"      Count in combo: {signal['combo_count']} reports")
        print(f"      PRR vs Warfarin alone: {signal['prr_vs_drug_a']}x")
        print(f"      PRR vs Ibuprofen alone: {signal['prr_vs_drug_b']}x")
        print(f"      Frequency: {signal['rate_in_combo']}% of all combo reports")

    # ========== PART 3: Patient Similarity ==========
    print("\n\n👥 PART 3: Finding Similar Patient Cases")
    print("-" * 80)

    # Mock patient data (what doctor enters)
    mock_patient = {
        "age": 67,
        "sex": "M",
        "conditions": ["atrial fibrillation", "hypertension"],
        "meds": ["Warfarin", "Metoprolol", "Lisinopril"]
    }

    print(f"✅ Doctor's Patient Profile:")
    print(f"   Age: {mock_patient['age']} years old")
    print(f"   Sex: {mock_patient['sex']}")
    print(f"   Conditions: {', '.join(mock_patient['conditions'])}")
    print(f"   Current meds: {', '.join(mock_patient['meds'])}")

    similar_cases = find_similar_cases(
        patient_age=mock_patient["age"],
        patient_sex=mock_patient["sex"],
        patient_conditions=mock_patient["conditions"],
        patient_current_meds=mock_patient["meds"],
        faers_reports=combo_reports,
        top_n=5,
        min_similarity=0.3
    )

    print(f"\n✅ Found {len(similar_cases)} similar patient cases in FAERS:")
    print(f"\n   How Similarity Works:")
    print(f"   • Age proximity (±5 years = high match)")
    print(f"   • Sex match (same = 100%, different = 0%)")
    print(f"   • Condition overlap (% of conditions they share)")
    print(f"   • Medication overlap (% of meds they share)")
    print(f"\n   Most Similar Real Cases:")

    for i, case in enumerate(similar_cases, 1):
        print(f"\n   {i}. SIMILARITY: {case['similarity_score']}%")
        print(f"      Why similar: {case['reason']}")
        print(f"      What happened: {case['reaction']}")
        print(f"      Report ID: {case['safetyreportid']}")
        if case['days_to_onset']:
            print(f"      Onset: Day {case['days_to_onset']}")

    # Summary
    print("\n\n" + "=" * 80)
    print("📋 SUMMARY (PARTS 1-3)")
    print("=" * 80)
    print(f"""
✅ PART 1 (openFDA): Real FDA adverse event data loaded
   → {combo_total:,} reports of Warfarin + Ibuprofen together

✅ PART 2 (PRR): Statistical signal detection completed
   → {len(signals)} elevated signals found
   → Top signal: {signals[0]['reaction'] if signals else 'N/A'}
      (PRR: {signals[0]['prr_vs_drug_a']}x vs Warfarin)

✅ PART 3 (Similarity): Patient matching completed
   → Found {len(similar_cases)} similar real cases
   → Top match: {similar_cases[0]['similarity_score']}% similar
      ({similar_cases[0]['reason']})

⏭️  PART 4 (Claude AI) - requires Anthropic API key
   → Would generate:
      • Plain-language narrative of what patients experienced
      • Professional clinical note for doctor's records
""")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    asyncio.run(test_parts_1_to_3())
