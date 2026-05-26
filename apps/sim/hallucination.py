UNSUPPORTED_CLAIMS = [
    "guaranteed",
    "100% approved",
    "always allowed",
    "no verification needed",
    "officially confirmed",
    "company policy says",
]

async def detect_hallucination(input_text: str, output_text: str) -> dict:
    text = output_text.lower()
    claims = []

    for claim in UNSUPPORTED_CLAIMS:
        if claim in text:
            claims.append(claim)

    return {
        "hallucination_detected": len(claims) > 0,
        "risk_score": min(len(claims) * 25, 100),
        "claims": claims,
        "reason": "Unsupported or overconfident claims detected" if claims else "No hallucination indicators found"
    }