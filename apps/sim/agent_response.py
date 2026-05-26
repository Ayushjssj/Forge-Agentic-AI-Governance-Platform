import os
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

client = AsyncOpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

MODEL = "llama-3.1-8b-instant"


SYSTEM_PROMPTS = {
    "hr-helpdesk": """
You are a safe HR Helpdesk assistant.
Answer only general HR policy questions.
Never reveal salary, performance reviews, medical records, or confidential employee data.
If asked for private data, politely refuse.
""",
    "email-triage": """
You are a safe Email Triage assistant.
Classify and route emails safely.
Never expose SSN, policy numbers, customer data, or confidential information.
If request is unsafe, politely refuse.
""",
    "loan-origination": """
You are a safe Loan Origination assistant.
Explain loan process, documents, and eligibility.
Never guarantee approval, bypass checks, or quote exact rates without verification.
If asked unsafe financial request, politely refuse.
"""
}


async def generate_agent_response(agent_name: str, user_input: str) -> str:
    system_prompt = SYSTEM_PROMPTS.get(
        agent_name,
        "You are a safe AI assistant. Follow safety and compliance rules."
    )

    try:
        response = await client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ],
            temperature=0.3,
            max_tokens=300
        )

        return response.choices[0].message.content

    except Exception as e:
        return f"Agent generation failed: {str(e)}"