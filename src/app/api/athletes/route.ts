import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const athletes = await prisma.athlete.findMany({
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json(athletes);
  } catch (error) {
    console.error("Error fetching athletes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 