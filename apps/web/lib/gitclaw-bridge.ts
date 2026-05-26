import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SIM_URL = process.env.SIM_URL || "http://localhost:8000";

export interface RunMessage {
  type: "delta" | "tool_call" | "cost" | "error" | "done";
  content: string;
  metadata?: Record<string, unknown>;
}

// PII guardrail — called before every tool use
export const piiGuardrail =
  (runId: string) => async (ctx: { args: unknown }) => {
    try {
      const res = await fetch(`${SIM_URL}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: JSON.stringify(ctx.args), runId }),
      });
      const { hits } = await res.json();
      if (hits && hits.length > 0) {
        await prisma.auditEntry.create({
          data: {
            runId,
            event: "pii_block",
            payload: JSON.stringify({ hits, args: ctx.args }),
          },
        });
        return { action: "block", reason: `PII detected: ${hits.join(", ")}` };
      }
    } catch (e) {
      console.error("PII guardrail error:", e);
    }
    return { action: "allow" };
  };

// Main agent runner — yields streamed messages
export async function* runAgent(opts: {
  agentDir: string;
  prompt: string;
  runId: string;
  model?: string;
  enablePiiGuard?: boolean;
}): AsyncGenerator<RunMessage> {
  const startTime = Date.now();

  try {
    // Simulate a gitclaw-style streaming response
    // Replace this block with: import { query } from 'gitclaw'
    // when gitclaw is properly installed as a workspace dep
    const mockResponses = [
      { type: "delta" as const, content: "Processing your request..." },
      {
        type: "tool_call" as const,
        content: "lookup_employee",
        metadata: { args: { name: "John" } },
      },
      { type: "delta" as const, content: " Found employee record." },
      {
        type: "cost" as const,
        content: "0.002",
        metadata: { model: opts.model || "gpt-4o-mini", tokens: 450 },
      },
      { type: "done" as const, content: "Response complete." },
    ];

    for (const msg of mockResponses) {
      await new Promise((r) => setTimeout(r, 200));

      if (
        opts.enablePiiGuard &&
        msg.type === "tool_call" &&
        msg.metadata?.args
      ) {
        const guard = await piiGuardrail(opts.runId)({ args: msg.metadata.args });
        if (guard.action === "block") {
          yield {
            type: "error",
            content: `Blocked: ${guard.reason}`,
          };
          continue;
        }
      }

      yield msg;

      await prisma.auditEntry.create({
        data: {
          runId: opts.runId,
          event: msg.type,
          payload: JSON.stringify(msg),
        },
      });
    }

    const duration = Date.now() - startTime;
    await prisma.run.update({
      where: { id: opts.runId },
      data: { duration, cost: 0.002, tokens: 450 },
    });
  } catch (err) {
    yield { type: "error", content: String(err) };
  }
}