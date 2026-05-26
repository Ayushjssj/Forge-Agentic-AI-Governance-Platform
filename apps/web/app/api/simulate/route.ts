import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { runAgent } from "@/lib/gitclaw-bridge";

const prisma = new PrismaClient();
const SIM_URL = process.env.SIM_URL || "http://localhost:8000";

export async function POST(req: Request) {
  const { agentId, scenarioCount = 10 } = await req.json();

  const agent = await prisma.agent.findUnique({ where: { id: agentId } });
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  // 1. Generate adversarial scenarios from FastAPI
  const scenRes = await fetch(`${SIM_URL}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agent_name: agent.name, count: scenarioCount }),
  });
  const { scenarios } = await scenRes.json();

  // 2. Create a parent run
  const run = await prisma.run.create({
    data: { agentId, prompt: `Simulation: ${scenarioCount} scenarios` },
  });

  // 3. Run scenarios in parallel (max 5 at a time)
  const results = [];
  const CONCURRENCY = 5;

  for (let i = 0; i < scenarios.length; i += CONCURRENCY) {
    const batch = scenarios.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(async (scenario: { input: string }) => {
        let output = "";
        for await (const msg of runAgent({
          agentDir: agent.dir,
          prompt: scenario.input,
          runId: run.id,
          enablePiiGuard: true,
        })) {
          if (msg.type === "delta") output += msg.content;
        }

        // 4. Judge each output
        const judgeRes = await fetch(`${SIM_URL}/judge`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: scenario.input, output, agent_name: agent.name }),
        });
        const { verdict, score } = await judgeRes.json();

        await prisma.scenario.create({
          data: { runId: run.id, input: scenario.input, output, verdict, score },
        });

        return { input: scenario.input, verdict, score };
      })
    );
    results.push(...batchResults);
  }

  // 5. Compute sigma score
  const defects = results.filter((r) => r.verdict === "fail").length;
  const sigmaRes = await fetch(
    `${SIM_URL}/sigma?defects=${defects}&total=${results.length}`
  );
  const { sigma } = await sigmaRes.json();

  await prisma.run.update({
    where: { id: run.id },
    data: { sigmaScore: sigma },
  });

  return NextResponse.json({ runId: run.id, results, sigma, defects, total: results.length });
}