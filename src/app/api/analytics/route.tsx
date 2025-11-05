// app/api/analytics/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [channels, direction, status] = await Promise.all([
      prisma.message.groupBy({
        by: ["channel"],
        _count: { _all: true },
      }),
      prisma.message.groupBy({
        by: ["direction"],
        _count: { _all: true },
      }),
      prisma.message.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
    ]);

    return NextResponse.json({
      channels: channels.map(c => ({ channel: c.channel, count: c._count._all })),
      direction: direction.map(d => ({ direction: d.direction, count: d._count._all })),
      status: status.map(s => ({ status: s.status, count: s._count._all })),
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
