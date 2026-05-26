"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const BLUEPRINTS = [
  {
    id: "hr-helpdesk",
    name: "HR Helpdesk",
    icon: "👥",
    description: "Answers employee HR queries: leave, payroll, policies.",
    tags: ["HR", "Internal"],
  },
  {
    id: "email-triage",
    name: "Email Triage",
    icon: "📩",
    description: "Classifies and routes insurance support emails.",
    tags: ["Support", "Insurance"],
  },
  {
    id: "loan-origination",
    name: "Loan Origination",
    icon: "🏦",
    description: "Guides loan applicants through eligibility and application.",
    tags: ["Banking", "Finance"],
  },
];

export default function BlueprintsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function forkBlueprint(blueprintId: string) {
    setLoading(blueprintId);

    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blueprintId }),
    });

    const agent = await res.json();
    setLoading(null);

    if (agent.id) router.push(`/studio/${agent.id}`);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b] p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 rounded-3xl bg-[#111827]/80 backdrop-blur border border-purple-500/20 p-10 shadow-2xl">
          <p className="inline-flex px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm mb-4">
            Agent Blueprint Library
          </p>

          <h1 className="text-5xl font-semibold tracking-tight text-white mb-3">
            Blueprint Library
          </h1>

          <p className="text-gray-300 text-lg max-w-2xl">
            Fork a pre-built AI agent blueprint and test it inside Forge Studio
            with simulations, risk scoring, and security analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {BLUEPRINTS.map((bp) => (
            <div
              key={bp.id}
              className="group bg-[#111827]/80 backdrop-blur rounded-2xl border border-purple-500/20 p-6 shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 transition-all flex flex-col h-full"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-2xl mb-5">
                {bp.icon}
              </div>

              <h2 className="font-semibold text-white text-xl mb-2 group-hover:text-purple-300">
                {bp.name}
              </h2>

              <p className="text-sm text-gray-300 mb-5 leading-6 min-h-[48px]">
                {bp.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6 min-h-[28px]">
                {bp.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <button
                onClick={() => forkBlueprint(bp.id)}
                disabled={loading === bp.id}
                className="mt-auto w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-xl hover:scale-[1.02] disabled:opacity-50 transition-all shadow-lg shadow-purple-500/20"
              >
                {loading === bp.id ? "Forking..." : "Fork & Open Studio"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}