"use client";

import { useState } from "react";

type AnalysisResult = {
  agent_output?: string;
  pii: string[];
  prompt_injection: {
    is_injection: boolean;
    severity: string;
    matches: string[];
  };
  hallucination: {
    hallucination_detected: boolean;
    risk_score: number;
    claims: string[];
    reason: string;
  };
  compliance: {
    compliant: boolean;
    standard: string;
    violations: string[];
    severity: string;
  };
  risk: {
    risk_score: number;
    risk_level: string;
  };
};

export default function SecurityPage() {
  const [agent, setAgent] = useState("hr-helpdesk");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function analyzeRisk() {
    setLoading(true);
    setResult(null);
    setOutput("");

    const res = await fetch("http://127.0.0.1:8000/auto-analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_name: agent,
        input,
        output: "",
      }),
    });

    const data = await res.json();

    setOutput(data.agent_output);
    setResult(data);
    setLoading(false);
  }

  const riskColor =
    result?.risk.risk_level === "critical"
      ? "text-red-300 bg-red-500/20 border-red-500/20"
      : result?.risk.risk_level === "high"
      ? "text-orange-300 bg-orange-500/20 border-orange-500/20"
      : result?.risk.risk_level === "medium"
      ? "text-yellow-300 bg-yellow-500/20 border-yellow-500/20"
      : "text-green-300 bg-green-500/20 border-green-500/20";

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b] p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 rounded-3xl bg-[#111827]/80 backdrop-blur border border-purple-500/20 p-8 shadow-2xl">
          <p className="inline-flex px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm mb-4">
            AI Risk Intelligence
          </p>

          <h1 className="text-5xl font-semibold tracking-tight text-white mb-3">
            AI Security Dashboard
          </h1>

          <p className="text-gray-300 text-lg max-w-3xl">
            Enter only a user prompt. Forge automatically generates the agent
            response, then analyzes PII, prompt injection, hallucination,
            compliance, and overall risk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#111827]/80 backdrop-blur rounded-2xl border border-purple-500/20 p-6 shadow-xl">
            <label className="text-sm font-medium text-purple-300">
              Select Agent
            </label>

            <select
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className="w-full mt-2 mb-5 border border-purple-500/20 bg-[#020617] text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="hr-helpdesk">HR Helpdesk</option>
              <option value="email-triage">Email Triage</option>
              <option value="loan-origination">Loan Origination</option>
            </select>

            <label className="text-sm font-medium text-purple-300">
              User Input
            </label>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a user prompt here..."
              className="w-full mt-2 mb-5 border border-purple-500/20 bg-[#020617] text-white placeholder:text-gray-500 rounded-xl px-4 py-3 h-36 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <label className="text-sm font-medium text-purple-300">
              Auto Generated Agent Output
            </label>

            <textarea
              value={output}
              readOnly
              className="w-full mt-2 mb-5 border border-purple-500/20 bg-[#020617] text-gray-300 placeholder:text-gray-500 rounded-xl px-4 py-3 h-36"
              placeholder="AI-generated response will appear here..."
            />

            <button
              onClick={analyzeRisk}
              disabled={loading || !input.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:scale-[1.02] disabled:opacity-50 transition-all shadow-lg shadow-purple-500/20"
            >
              {loading ? "Generating & Analyzing..." : "Generate Output & Analyze Risk"}
            </button>
          </div>

          <div className="bg-[#111827]/80 backdrop-blur rounded-2xl border border-purple-500/20 p-6 shadow-xl">
            {!result && (
              <div className="h-full min-h-[400px] flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  Run analysis to see the security report.
                </p>
              </div>
            )}

            {result && (
              <div>
                <div
                  className={`inline-flex px-5 py-3 rounded-full border font-semibold mb-6 ${riskColor}`}
                >
                  Risk Score: {result.risk.risk_score}/100 —{" "}
                  {result.risk.risk_level.toUpperCase()}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card
                    title="PII Detection"
                    status={result.pii.length > 0 ? "Detected" : "Clear"}
                    danger={result.pii.length > 0}
                    details={result.pii.join(", ") || "No PII found"}
                  />

                  <Card
                    title="Prompt Injection"
                    status={
                      result.prompt_injection.is_injection
                        ? "Detected"
                        : "Clear"
                    }
                    danger={result.prompt_injection.is_injection}
                    details={`Severity: ${result.prompt_injection.severity}`}
                  />

                  <Card
                    title="Hallucination"
                    status={
                      result.hallucination.hallucination_detected
                        ? "Detected"
                        : "Clear"
                    }
                    danger={result.hallucination.hallucination_detected}
                    details={result.hallucination.reason}
                  />

                  <Card
                    title="Compliance"
                    status={
                      result.compliance.compliant
                        ? "Compliant"
                        : "Violation"
                    }
                    danger={!result.compliance.compliant}
                    details={result.compliance.standard}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Card({
  title,
  status,
  danger,
  details,
}: {
  title: string;
  status: string;
  danger: boolean;
  details: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        danger
          ? "bg-red-500/10 border-red-500/20"
          : "bg-green-500/10 border-green-500/20"
      }`}
    >
      <h3 className="font-semibold text-white mb-2">{title}</h3>

      <p
        className={
          danger
            ? "text-red-300 font-semibold"
            : "text-green-300 font-semibold"
        }
      >
        {danger ? "❌ " : "✅ "}
        {status}
      </p>

      <p className="text-sm text-gray-300 mt-2 leading-6">{details}</p>
    </div>
  );
}