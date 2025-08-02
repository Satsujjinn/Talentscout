import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const athletes = await prisma.user.findMany({
      where: {
        role: "athlete",
      },
      include: {
        profile: true,
      },
    });

    // Transform the data to match the expected format
    const transformedAthletes = athletes.map((user) => ({
      id: user.id,
      name: user.profile?.name || "Unknown",
      bio: user.profile?.bio || null,
      sport: user.profile?.sport || null,
      achievements: user.profile?.achievements || null,
      stats: user.profile?.stats || null,
      imageUrl: user.profile?.imageUrl || null,
      user: {
        id: user.id,
      },
    }));

    return NextResponse.json(transformedAthletes);
  } catch (error) {
    console.error("Error fetching athletes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 