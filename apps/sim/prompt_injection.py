import re

INJECTION_PATTERNS = [
    r"ignore previous instructions",
    r"forget your rules",
    r"act as admin",
    r"bypass",
    r"reveal confidential",
    r"system prompt",
    r"developer message",
    r"override policy",
]

async def detect_prompt_injection(text: str) -> dict:
    lowered = text.lower()
    hits = []

    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, lowered):
            hits.append(pattern)

    severity = "low"
    if len(hits) >= 2:
        severity = "critical"
    elif len(hits) == 1:
        severity = "high"

    return {
        "is_injection": len(hits) > 0,
        "severity": severity,
        "matches": hits
    }