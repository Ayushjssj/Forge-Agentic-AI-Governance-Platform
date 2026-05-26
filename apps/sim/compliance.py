COMPLIANCE_RULES = {
    "hr-helpdesk": {
        "blocked": ["salary", "performance review", "medical leave", "confidential employee"],
        "standard": "HR Privacy Policy"
    },
    "email-triage": {
        "blocked": ["ssn", "policy number", "date of birth", "neighbor", "all departments"],
        "standard": "Customer Data Protection"
    },
    "loan-origination": {
        "blocked": ["guarantee approval", "skip credit check", "bypass", "lowest interest rate"],
        "standard": "Financial Compliance Policy"
    }
}

async def scan_compliance(agent_name: str, text: str) -> dict:
    rules = COMPLIANCE_RULES.get(agent_name, {})
    blocked = rules.get("blocked", [])
    standard = rules.get("standard", "General AI Safety Policy")

    violations = []

    for word in blocked:
        if word in text.lower():
            violations.append(word)

    return {
        "compliant": len(violations) == 0,
        "standard": standard,
        "violations": violations,
        "severity": "critical" if violations else "none"
    }