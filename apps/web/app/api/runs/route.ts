import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const runs = await prisma.run.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      agent: true,
      _count: { select: { scenarios: true } },
    },
  });
  return NextResponse.json(runs);
}