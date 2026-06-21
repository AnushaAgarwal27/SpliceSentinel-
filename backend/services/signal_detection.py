"""
PART 2: Signal Detection - Proportional Reporting Ratio (PRR)

Simplified PRR implementation for pharmacovigilance signal detection.

⚠️ LIMITATION: This is a simplified PRR, NOT the more rigorous Omega
shrinkage or BCPNN methods used in published pharmacovigilance research.
Suitable for hackathon/screening; do not use for regulatory decisions.

PRR Formula:
  PRR = (a/b) / (c/d)
  where:
    a = reaction count in combination reports
    b = total combination reports
    c = reaction count in baseline (single drug) reports
    d = total baseline reports

Threshold: PRR >= 2.0 typically indicates elevated signal in literature.
We require PRR >= 2.0 against BOTH Drug A alone AND Drug B alone.
"""

from typing import Dict, List


def calculate_prr(
    reaction_count_in_group: int,
    total_reports_in_group: int,
    reaction_count_baseline: int,
    total_reports_baseline: int
) -> float:
    """
    Calculate Proportional Reporting Ratio.

    Args:
        reaction_count_in_group: # of reports with this reaction in combo
        total_reports_in_group: Total combo reports
        reaction_count_baseline: # of reports with this reaction in baseline
        total_reports_baseline: Total baseline reports

    Returns:
        PRR value (float). PRR > 2.0 = potential signal.
        Returns 0.0 if denominators are 0 (avoid division errors).
    """
    if total_reports_in_group == 0 or total_reports_baseline == 0:
        return 0.0

    rate_in_group = reaction_count_in_group / total_reports_in_group
    rate_baseline = reaction_count_baseline / total_reports_baseline

    if rate_baseline == 0:
        # If reaction doesn't appear in baseline, PRR is undefined
        # Return very high PRR to flag as potential signal
        return 999.0 if reaction_count_in_group > 0 else 0.0

    return rate_in_group / rate_baseline


def find_elevated_signals(
    combo_reactions: Dict[str, int],
    combo_total: int,
    drug_a_reactions: Dict[str, int],
    drug_a_total: int,
    drug_b_reactions: Dict[str, int],
    drug_b_total: int,
    prr_threshold: float = 2.0
) -> List[Dict]:
    """
    Find reactions with elevated PRR in combination vs. both baselines.

    A reaction is flagged ONLY if:
    - PRR vs Drug A >= threshold AND
    - PRR vs Drug B >= threshold

    This conservative approach reduces false positives.

    Args:
        combo_reactions: Dict of {reaction: count} from combination
        combo_total: Total combination reports
        drug_a_reactions: Dict of {reaction: count} from Drug A alone
        drug_a_total: Total Drug A reports
        drug_b_reactions: Dict of {reaction: count} from Drug B alone
        drug_b_total: Total Drug B reports
        prr_threshold: PRR value to flag as signal (default 2.0)

    Returns:
        List of dicts, each with:
        {
            "reaction": str,
            "combo_count": int,
            "rate_in_combo": float (percentage),
            "prr_vs_drug_a": float,
            "prr_vs_drug_b": float
        }
        Sorted by combo_count descending.
    """
    flagged = []

    for reaction, combo_count in combo_reactions.items():
        baseline_a_count = drug_a_reactions.get(reaction, 0)
        baseline_b_count = drug_b_reactions.get(reaction, 0)

        # Calculate PRR against both baselines
        prr_vs_a = calculate_prr(
            combo_count, combo_total,
            baseline_a_count, drug_a_total
        )
        prr_vs_b = calculate_prr(
            combo_count, combo_total,
            baseline_b_count, drug_b_total
        )

        # Flag ONLY if elevated vs BOTH baselines
        if prr_vs_a >= prr_threshold and prr_vs_b >= prr_threshold:
            rate_in_combo = (combo_count / combo_total * 100) if combo_total > 0 else 0
            flagged.append({
                "reaction": reaction,
                "combo_count": combo_count,
                "rate_in_combo": round(rate_in_combo, 2),
                "prr_vs_drug_a": round(prr_vs_a, 2),
                "prr_vs_drug_b": round(prr_vs_b, 2)
            })

    # Sort by frequency (most common first)
    flagged.sort(key=lambda x: x["combo_count"], reverse=True)

    return flagged


def calculate_data_confidence(combo_total: int) -> Dict[str, str]:
    """
    Assess confidence level based on report count.

    Args:
        combo_total: Total combination reports found

    Returns:
        {
            "level": "HIGH" | "MODERATE" | "LOW",
            "message": Human-readable explanation
        }

    Thresholds (subjective, tuned for hackathon):
    - HIGH: >= 30 reports (sufficient sample)
    - MODERATE: 10-29 reports (some signal but limited)
    - LOW: < 10 reports (unreliable, likely noisy)
    """
    if combo_total >= 30:
        return {
            "level": "HIGH",
            "message": f"Based on {combo_total} reports. Sample size adequate."
        }
    elif combo_total >= 10:
        return {
            "level": "MODERATE",
            "message": f"Based on {combo_total} reports. Interpret with caution."
        }
    else:
        return {
            "level": "LOW",
            "message": f"Only {combo_total} reports found. Results unreliable. "
                      "More data needed for confident conclusion."
        }
