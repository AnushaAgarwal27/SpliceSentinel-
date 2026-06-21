"""
TESTING PART 1 & 2: Quick validation script

Run this to verify openFDA queries work and PRR calculation is sane.

Usage:
    python3 test_openfda.py
"""

import asyncio
from services.openfda_service import check_drug_combination
from services.signal_detection import find_elevated_signals, calculate_data_confidence


async def test_warfarin_ibuprofen():
    """Test with the known dangerous combination."""
    print("\n" + "=" * 70)
    print("🔬 TESTING: Warfarin + Ibuprofen")
    print("=" * 70)

    print("\n⏳ Querying openFDA for data...")
    print("  - Warfarin + Ibuprofen (combination)")
    print("  - Warfarin alone (baseline)")
    print("  - Ibuprofen alone (baseline)")

    data = await check_drug_combination("Warfarin", "Ibuprofen")

    # Display raw counts
    print("\n✅ QUERY RESULTS:")
    print(f"  Combination reports: {data['combo_total']}")
    print(f"  Warfarin alone: {data['drug_a_total']}")
    print(f"  Ibuprofen alone: {data['drug_b_total']}")

    # Display top 10 reactions in combination
    print(f"\n📊 TOP REACTIONS in Warfarin + Ibuprofen (top 10):")
    sorted_reactions = sorted(
        data['combo_reactions'].items(),
        key=lambda x: x[1],
        reverse=True
    )
    for i, (reaction, count) in enumerate(sorted_reactions[:10], 1):
        print(f"  {i}. {reaction}: {count} reports")

    # Calculate PRR
    print("\n🔍 SIGNAL DETECTION (PRR Analysis):")
    signals = find_elevated_signals(
        data['combo_reactions'], data['combo_total'],
        data['drug_a_reactions'], data['drug_a_total'],
        data['drug_b_reactions'], data['drug_b_total'],
        prr_threshold=2.0
    )

    if signals:
        print(f"\n⚠️  {len(signals)} ELEVATED SIGNALS DETECTED:\n")
        for i, signal in enumerate(signals, 1):
            print(f"  {i}. {signal['reaction']}")
            print(f"     Count: {signal['combo_count']}")
            print(f"     Rate in combo: {signal['rate_in_combo']}%")
            print(f"     PRR vs Warfarin alone: {signal['prr_vs_drug_a']}")
            print(f"     PRR vs Ibuprofen alone: {signal['prr_vs_drug_b']}")
            print()
    else:
        print("  ✓ No elevated signals detected (all PRR < 2.0)")

    # Data confidence
    print("📈 DATA CONFIDENCE:")
    confidence = calculate_data_confidence(data['combo_total'])
    print(f"  Level: {confidence['level']}")
    print(f"  Message: {confidence['message']}")

    print("\n" + "=" * 70)
    print("✅ Test complete!")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    asyncio.run(test_warfarin_ibuprofen())
