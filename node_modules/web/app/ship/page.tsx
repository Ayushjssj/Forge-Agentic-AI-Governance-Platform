"use client";

export default function ShipPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b] p-8 text-white">

      <div className="max-w-5xl mx-auto">

        {/* HERO */}

        <div className="mb-8 rounded-3xl bg-[#111827]/80 backdrop-blur border border-purple-500/20 p-8 shadow-2xl">

          <p className="inline-flex px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm mb-4">
            AI Deployment Pipeline
          </p>

          <h1 className="text-5xl font-semibold tracking-tight text-white mb-3">
            Ship Agent
          </h1>

          <p className="text-gray-300 text-lg max-w-3xl">
            Publish your AI agent to GitHub with simulation reports,
            sigma scores, governance checks and security analysis.
          </p>
        </div>

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* FORM */}

          <div className="lg:col-span-2 bg-[#111827]/80 backdrop-blur rounded-2xl border border-purple-500/20 p-6 shadow-xl">

            <h2 className="text-xl font-semibold text-white mb-6">
              GitHub Deployment
            </h2>

            <div className="space-y-5">

              <div>
                <label className="text-sm text-purple-300 mb-2 block">
                  GitHub Username / Organization
                </label>

                <input
                  placeholder="e.g. AyushPandey"
                  className="w-full border border-purple-500/20 rounded-xl px-4 py-3 bg-[#020617] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-sm text-purple-300 mb-2 block">
                  Repository Name
                </label>

                <input
                  placeholder="e.g. forge-ai-platform"
                  className="w-full border border-purple-500/20 rounded-xl px-4 py-3 bg-[#020617] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-sm text-purple-300 mb-2 block">
                  Deployment Notes
                </label>

                <textarea
                  placeholder="Add release notes, governance summary or simulation comments..."
                  className="w-full h-36 border border-purple-500/20 rounded-xl px-4 py-3 bg-[#020617] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
  onClick={() =>
    alert(
      "Deployment request created successfully! In production, this will create a GitHub Pull Request with simulation and security reports."
    )
  }
  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-medium hover:scale-[1.01] transition-all shadow-lg shadow-purple-500/20"
>
  🚀 Create GitHub Pull Request
</button>
            </div>
          </div>

          {/* SIDE PANEL */}

          <div className="space-y-6">

            <div className="bg-[#111827]/80 backdrop-blur rounded-2xl border border-purple-500/20 p-6 shadow-xl">

              <h3 className="text-lg font-semibold text-white mb-4">
                Deployment Checklist
              </h3>

              <div className="space-y-3 text-sm">

                <div className="flex items-center gap-3 text-green-300">
                  ✅ Simulation Completed
                </div>

                <div className="flex items-center gap-3 text-green-300">
                  ✅ Sigma Score Generated
                </div>

                <div className="flex items-center gap-3 text-yellow-300">
                  ⚠ Governance Review Pending
                </div>

                <div className="flex items-center gap-3 text-purple-300">
                  🛡 Security Scan Enabled
                </div>

              </div>
            </div>

            <div className="bg-[#111827]/80 backdrop-blur rounded-2xl border border-purple-500/20 p-6 shadow-xl">

              <h3 className="text-lg font-semibold text-white mb-4">
                Deployment Stats
              </h3>

              <div className="space-y-4">

                <div className="rounded-xl bg-[#020617] border border-purple-500/10 p-4">
                  <p className="text-gray-400 text-sm">
                    Security Score
                  </p>

                  <p className="text-2xl font-bold text-green-400">
                    92%
                  </p>
                </div>

                <div className="rounded-xl bg-[#020617] border border-purple-500/10 p-4">
                  <p className="text-gray-400 text-sm">
                    Sigma Reliability
                  </p>

                  <p className="text-2xl font-bold text-purple-300">
                    σ 4.2
                  </p>
                </div>

                <div className="rounded-xl bg-[#020617] border border-purple-500/10 p-4">
                  <p className="text-gray-400 text-sm">
                    Compliance Status
                  </p>

                  <p className="text-2xl font-bold text-blue-300">
                    Passed
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}