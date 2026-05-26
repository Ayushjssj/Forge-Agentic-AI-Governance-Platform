"use client";
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";

interface Message {
  role: "user" | "agent";
  content: string;
}

interface SimResult {
  input: string;
  verdict: string;
  score: number;
}

interface SimReport {
  sigma: number;
  defects: number;
  total: number;
  results: SimResult[];
}

export default function StudioPage() {
  const { id } = useParams();

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [simReport, setSimReport] = useState<SimReport | null>(null);

  const [simLoading, setSimLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage() {
    if (!prompt.trim()) return;

    const userMsg = prompt.trim();

    setPrompt("");
    setChatLoading(true);

    setMessages((m) => [
      ...m,
      { role: "user", content: userMsg },
    ]);

    const res = await fetch("/api/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agentId: id,
        prompt: userMsg,
      }),
    });

    const reader = res.body?.getReader();

    const decoder = new TextDecoder();

    let agentReply = "";

    setMessages((m) => [
      ...m,
      { role: "agent", content: "" },
    ]);

    while (reader) {
      const { value, done } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value);

      const lines = chunk
        .split("\n")
        .filter((l) => l.startsWith("data:"));

      for (const line of lines) {
        try {
          const msg = JSON.parse(line.slice(5));

          if (msg.type === "delta") {
            agentReply += msg.content;

            setMessages((m) => {
              const updated = [...m];

              updated[updated.length - 1] = {
                role: "agent",
                content: agentReply,
              };

              return updated;
            });
          }
        } catch {}
      }
    }

    setChatLoading(false);
  }

  async function runSimulation() {
    setSimLoading(true);

    setSimReport(null);

    const res = await fetch("/api/simulate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agentId: id,
        scenarioCount: 10,
      }),
    });

    const data = await res.json();

    setSimReport(data);

    setSimLoading(false);
  }

  const sigmaColor = (s: number) =>
    s >= 4
      ? "text-green-400 bg-green-500/20 border-green-500/20"
      : s >= 3
      ? "text-yellow-400 bg-yellow-500/20 border-yellow-500/20"
      : "text-red-400 bg-red-500/20 border-red-500/20";

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b] p-6 text-white">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-8 rounded-3xl bg-[#111827]/80 backdrop-blur border border-purple-500/20 p-8 shadow-2xl">

          <div className="flex items-center justify-between">

            <div>
              <p className="inline-flex px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm mb-4">
                AI Simulation Studio
              </p>

              <h1 className="text-5xl font-semibold tracking-tight text-white mb-2">
                Forge Studio
              </h1>

              <p className="text-gray-300 text-lg">
                Test, simulate and secure your AI agents in real time.
              </p>
            </div>

            <button
              onClick={runSimulation}
              disabled={simLoading}
              className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium hover:scale-[1.02] disabled:opacity-50 transition-all shadow-lg shadow-purple-500/20"
            >
              {simLoading
                ? "Simulating..."
                : "Run Simulation (10 scenarios)"}
            </button>
          </div>
        </div>

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* CHAT PANEL */}

          <div className="bg-[#111827]/80 backdrop-blur rounded-2xl border border-purple-500/20 flex flex-col h-[700px] shadow-xl">

            <div className="p-5 border-b border-purple-500/10">
              <h2 className="font-semibold text-white text-lg">
                Live AI Chat
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Interact with your AI agent in real time
              </p>
            </div>

            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto p-5 space-y-4"
            >
              {messages.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500 text-sm">
                    Start chatting with your AI agent...
                  </p>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-6 shadow-md ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                        : "bg-[#1e293b] text-gray-200 border border-purple-500/10"
                    }`}
                  >
                    {m.content || "..."}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-purple-500/10 flex gap-3">

              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && sendMessage()
                }
                placeholder="Type your message..."
                className="flex-1 rounded-xl border border-purple-500/20 bg-[#020617] text-white placeholder:text-gray-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                onClick={sendMessage}
                disabled={chatLoading}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm hover:scale-[1.02] disabled:opacity-50 transition-all"
              >
                Send
              </button>
            </div>
          </div>

          {/* RESULTS PANEL */}

          <div className="bg-[#111827]/80 backdrop-blur rounded-2xl border border-purple-500/20 h-[700px] overflow-y-auto shadow-xl">

            <div className="p-5 border-b border-purple-500/10">
              <h2 className="font-semibold text-white text-lg">
                Simulation Results
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Analyze AI safety and reliability metrics
              </p>
            </div>

            {simLoading && (
              <div className="flex items-center justify-center h-40">
                <p className="text-sm text-purple-300 animate-pulse">
                  Running scenarios...
                </p>
              </div>
            )}

            {simReport && (
              <div className="p-5">

                <div
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-full border font-semibold text-lg mb-6 ${sigmaColor(
                    simReport.sigma
                  )}`}
                >
                  σ = {simReport.sigma.toFixed(2)}

                  <span className="text-sm font-normal">
                    ({simReport.defects} failures /{" "}
                    {simReport.total} total)
                  </span>
                </div>

                <div className="space-y-3">

                  {simReport.results.map((r, i) => (

                    <div
                      key={i}
                      className={`p-4 rounded-xl border text-sm ${
                        r.verdict === "pass"
                          ? "border-green-500/20 bg-green-500/10"
                          : "border-red-500/20 bg-red-500/10"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">

                        <span className="text-gray-200 flex-1 leading-6">
                          {r.input.slice(0, 90)}...
                        </span>

                        <span
                          className={`font-medium shrink-0 ${
                            r.verdict === "pass"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {r.verdict === "pass"
                            ? "✓ pass"
                            : "✗ fail"}
                        </span>
                      </div>
                    </div>

                  ))}
                </div>
              </div>
            )}

            {!simReport && !simLoading && (
              <div className="flex items-center justify-center h-40">
                <p className="text-sm text-gray-500">
                  Run a simulation to test your AI agent
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}