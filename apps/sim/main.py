from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from scenarios import generate_scenarios
from judge import judge_output
from sigma import sigma_from_defect_rate
from pii import scan_text
from prompt_injection import detect_prompt_injection
from hallucination import detect_hallucination
from compliance import scan_compliance
from redteam import generate_redteam_attacks
from risk_score import calculate_risk_score
from agent_response import generate_agent_response

app = FastAPI(title="Forge Simulation Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    agent_name: str
    input: str
    output: str = ""

class SimulateRequest(BaseModel):
    agent_name: str
    count: int = 10

class JudgeRequest(BaseModel):
    input: str
    output: str
    agent_name: str

class ScanRequest(BaseModel):
    text: str
    runId: str = ""

@app.post("/simulate")
async def simulate(req: SimulateRequest):
    scenarios = await generate_scenarios(req.agent_name, req.count)
    return {"scenarios": scenarios}

@app.post("/judge")
async def judge(req: JudgeRequest):
    result = await judge_output(req.input, req.output, req.agent_name)
    return result

@app.get("/sigma")
def sigma(defects: int, total: int):
    score = sigma_from_defect_rate(defects, total)
    return {"sigma": score}

@app.post("/scan")
async def scan(req: ScanRequest):
    hits = await scan_text(req.text)
    return {"hits": hits}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/analyze")
async def analyze(req: AnalyzeRequest):
    pii_hits = await scan_text(req.input + " " + req.output)
    injection = await detect_prompt_injection(req.input)
    hallucination = await detect_hallucination(req.input, req.output)
    compliance = await scan_compliance(req.agent_name, req.input + " " + req.output)
    risk = await calculate_risk_score(
        pii_hits,
        injection,
        hallucination,
        compliance
    )

    return {
        "pii": pii_hits,
        "prompt_injection": injection,
        "hallucination": hallucination,
        "compliance": compliance,
        "risk": risk
    }


@app.get("/redteam/{agent_name}")
async def redteam(agent_name: str):
    return await generate_redteam_attacks(agent_name)

@app.post("/auto-analyze")
async def auto_analyze(req: AnalyzeRequest):
    agent_output = await generate_agent_response(req.agent_name, req.input)

    pii_hits = await scan_text(req.input + " " + agent_output)
    injection = await detect_prompt_injection(req.input)
    hallucination = await detect_hallucination(req.input, agent_output)
    compliance = await scan_compliance(req.agent_name, req.input + " " + agent_output)
    risk = await calculate_risk_score(
        pii_hits,
        injection,
        hallucination,
        compliance
    )

    return {
        "agent_output": agent_output,
        "pii": pii_hits,
        "prompt_injection": injection,
        "hallucination": hallucination,
        "compliance": compliance,
        "risk": risk
    }