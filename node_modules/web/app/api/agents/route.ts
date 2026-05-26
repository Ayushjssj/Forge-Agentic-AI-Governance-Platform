import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const BLUEPRINTS_DIR = path.join(process.cwd(), "../../blueprints");

export async function GET() {
  const agents = await prisma.agent.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { runs: true } } },
  });
  return NextResponse.json(agents);
}

export async function POST(req: Request) {
  const { blueprintId } = await req.json();
  const srcDir = path.join(BLUEPRINTS_DIR, blueprintId);

  if (!fs.existsSync(srcDir)) {
    return NextResponse.json({ error: "Blueprint not found" }, { status: 404 });
  }

  const workspaceDir = path.join(process.cwd(), ".forge", "workspace", Date.now().toString());
  fs.mkdirSync(workspaceDir, { recursive: true });
  fs.cpSync(srcDir, workspaceDir, { recursive: true });

  const yaml = fs.readFileSync(path.join(workspaceDir, "agent.yaml"), "utf-8");
  const nameMatch = yaml.match(/^name:\s*(.+)$/m);
  const agentName = nameMatch ? nameMatch[1].trim() : blueprintId;

  const agent = await prisma.agent.create({
    data: { name: agentName, dir: workspaceDir },
  });

  return NextResponse.json(agent);
}