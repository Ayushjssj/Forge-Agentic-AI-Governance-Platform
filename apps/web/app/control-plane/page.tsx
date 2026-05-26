"use client";
import { useState, useEffect } from "react";

interface Run {
  id: string;
  prompt: string;
  sigmaScore: number | null;
  cost: number | null;
  tokens: number | null;
  duration: number | null;
  createdAt: string;
  agent: { name: string };
  _count: { scenarios: number };
}

export default function ControlPlanePage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/runs")
      .then((r) => r.json())
      .then((data) => {
        setRuns(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sigmaColor = (s: number | null) => {
    if (!s) return "text-gray-400";
    if (s >= 4) return "text-green-400";
    if (s >= 3) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b] p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 rounded-3xl bg-[#111827]/80 backdrop-blur border border-purple-500/20 p-8 shadow-2xl">
          <p className="inline-flex px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm mb-4">
            AI Observability
          </p>

          <h1 className="text-5xl font-semibold tracking-tight text-white mb-3">
            Control Plane
          </h1>

          <p className="text-gray-300 text-lg">
            Monitor all agent runs, sigma scores, costs, scenarios and audit data.
          </p>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading runs...</p>
        ) : runs.length === 0 ? (
          <div className="bg-[#111827]/80 rounded-2xl border border-purple-500/20 p-12 text-center shadow-xl">
            <p className="text-gray-400">
              No runs yet. Fork a blueprint and run a simulation.
            </p>
          </div>
        ) : (
          <div className="bg-[#111827]/80 backdrop-blur rounded-2xl border border-purple-500/20 overflow-hidden shadow-xl">
            <table className="w-full text-sm">
              <thead className="bg-[#020617] border-b border-purple-500/20">
                <tr>
                  <th className="text-left px-4 py-4 font-medium text-purple-300">Agent</th>
                  <th className="text-left px-4 py-4 font-medium text-purple-300">Prompt</th>
                  <th className="text-right px-4 py-4 font-medium text-purple-300">σ score</th>
                  <th className="text-right px-4 py-4 font-medium text-purple-300">Cost ($)</th>
                  <th className="text-right px-4 py-4 font-medium text-purple-300">Scenarios</th>
                  <th className="text-right px-4 py-4 font-medium text-purple-300">Time</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-purple-500/10">
                {runs.map((run) => (
                  <tr key={run.id} className="hover:bg-purple-500/10 transition-colors">
                    <td className="px-4 py-4 font-medium text-white">
                      {run.agent.name}
                    </td>

                    <td className="px-4 py-4 text-gray-300 max-w-[240px] truncate">
                      {run.prompt}
                    </td>

                    <td className={`px-4 py-4 text-right font-semibold ${sigmaColor(run.sigmaScore)}`}>
                      {run.sigmaScore ? `σ ${run.sigmaScore.toFixed(2)}` : "—"}
                    </td>

                    <td className="px-4 py-4 text-right text-gray-300">
                      {run.cost ? `$${run.cost.toFixed(4)}` : "—"}
                    </td>

                    <td className="px-4 py-4 text-right text-gray-300">
                      {run._count.scenarios}
                    </td>

                    <td className="px-4 py-4 text-right text-gray-400 text-xs">
                      {new Date(run.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}