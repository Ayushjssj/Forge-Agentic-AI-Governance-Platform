import Link from "next/link";

const features = [
  {
    title: "Blueprints",
    icon: "📋",
    href: "/blueprints",
    desc: "Browse and fork pre-built agent templates",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Control Plane",
    icon: "📊",
    href: "/control-plane",
    desc: "Observe runs, costs, sigma scores and audit logs",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Ship",
    icon: "🚀",
    href: "/ship",
    desc: "Open a GitHub PR with your sigma score",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Security Dashboard",
    icon: "🛡️",
    href: "/security",
    desc: "Analyze AI risks, prompt injections and compliance",
    color: "from-red-500 to-orange-500",
  },
  {
    title: "Red Team Lab",
    icon: "⚔️",
    href: "/security",
    desc: "Generate attacks to test agent safety",
    color: "from-gray-700 to-black",
  },
  {
    title: "Risk Analyzer",
    icon: "⚠️",
    href: "/security",
    desc: "Score prompts for PII, hallucination and policy risk",
    color: "from-yellow-500 to-amber-600",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b] p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <section className="relative mb-10 rounded-3xl bg-[#111827]/80 backdrop-blur border border-purple-500/20 p-10 shadow-2xl">
        <div className="absolute top-6 right-8 text-right space-y-1">
  <p className="text-white font-semibold text-lg">
    Built By Ayush Pandey
  </p>

  <p className="text-sm text-purple-300">
    • Agentic AI Developer
  </p>

  <p className="text-sm text-purple-300">
     • GenAI Engineer
  </p>

  <p className="text-sm text-purple-300">
    • AI Security Developer
  </p>
</div>
          <div className="inline-flex px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm mb-4">
            Agentic AI Governance Platform
          </div>

          <div className="flex items-center gap-4 mb-4">
  <div className="text-6xl">🛡️</div>

  <div>
    <h1 className="text-6xl font-semibold tracking-tight text-white">
  Forge
</h1>

    <p className="text-purple-300 mt-1">
      AI Governance • AI Security • Red Teaming
    </p>
  </div>
</div>

          <p className="text-xl text-gray-600 max-w-3xl">
            Production-grade AI agents — simulate, observe, govern, secure,
            and ship with confidence.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Stat label="Agents" value="3" />
            <Stat label="Security Checks" value="5+" />
            <Stat label="Risk Engine" value="Live" />
            <Stat label="Backend" value="FastAPI" />
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group bg-[#111827]/80 backdrop-blur rounded-2xl border border-purple-500/20 p-6 shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 transition-all"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-5`}
              >
                {feature.icon}
              </div>

              <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400">
                {feature.title}
              </h2>

              <p className="text-gray-300 text-sm leading-6">
                {feature.desc}
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-gray-950 text-white p-6">
            <h3 className="text-xl font-semibold mb-3">What Forge Detects</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>✅ Prompt Injection Attacks</li>
              <li>✅ PII Leakage</li>
              <li>✅ Hallucinated Claims</li>
              <li>✅ Compliance Violations</li>
              <li>✅ Risky Agent Behavior</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Current Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "FastAPI", "Prisma", "SQLite", "Groq", "Tailwind", "Agentic AI"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm"
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>
        </section>
        <footer className="mt-16 text-center text-gray-400 text-sm pb-8">
  <p>© 2026 Forge AI Platform — Built By Ayush Pandey</p>

  <p className="mt-2 text-xs text-gray-500">
    Unauthorized Copying, or Redistribution of this Software
    Without Permission May Constitute Copyright Infringement.
  </p>
</footer>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}