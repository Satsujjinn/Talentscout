import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let matchRequests;

    if (dbUser.role === "recruiter") {
      // Recruiters see requests they've sent
      matchRequests = await prisma.matchRequest.findMany({
        where: {
          recruiterId: user.id,
        },
        include: {
          athlete: {
            include: {
              profile: true,
            },
          },
          recruiter: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      // Athletes see requests they've received
      matchRequests = await prisma.matchRequest.findMany({
        where: {
          athleteId: user.id,
        },
        include: {
          athlete: {
            include: {
              profile: true,
            },
          },
          recruiter: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json(matchRequests);
  } catch (error) {
    console.error("Error fetching match requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || dbUser.role !== "recruiter") {
      return NextResponse.json(
        { error: "Only recruiters can send match requests" },
        { status: 403 }
      );
    }

    const { athleteId, message } = await request.json();

    if (!athleteId) {
      return NextResponse.json(
        { error: "Athlete ID is required" },
        { status: 400 }
      );
    }

    // Check if athlete exists
    const athlete = await prisma.user.findUnique({
      where: { id: athleteId },
    });

    if (!athlete || athlete.role !== "athlete") {
      return NextResponse.json(
        { error: "Athlete not found" },
        { status: 404 }
      );
    }

    // Check if request already exists
    const existingRequest = await prisma.matchRequest.findFirst({
      where: {
        recruiterId: user.id,
        athleteId: athleteId,
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "Match request already exists" },
        { status: 409 }
      );
    }

    const matchRequest = await prisma.matchRequest.create({
      data: {
        recruiterId: user.id,
        athleteId: athleteId,
        status: "pending",
      },
      include: {
        athlete: {
          include: {
            profile: true,
          },
        },
        recruiter: {
          include: {
            profile: true,
          },
        },
      },
    });

    // Send socket notification to athlete
    try {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
      await fetch(`${socketUrl}/api/socket/notify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: athleteId,
          event: "new-match-request",
          data: {
            matchRequest,
          },
        }),
      });
    } catch (socketError) {
      console.warn("Failed to send socket notification:", socketError);
    }

    return NextResponse.json(matchRequest);
  } catch (error) {
    console.error("Error creating match request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 