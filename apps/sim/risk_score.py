async def calculate_risk_score(
    pii_hits: list,
    injection_result: dict,
    hallucination_result: dict,
    compliance_result: dict
) -> dict:
    score = 0

    if pii_hits:
        score += 30

    if injection_result.get("is_injection"):
        score += 30

    if hallucination_result.get("hallucination_detected"):
        score += 20

    if not compliance_result.get("compliant"):
        score += 20

    score = min(score, 100)

    if score >= 75:
        level = "critical"
    elif score >= 50:
        level = "high"
    elif score >= 25:
        level = "medium"
    else:
        level = "low"

    return {
        "risk_score": score,
        "risk_level": level
    }