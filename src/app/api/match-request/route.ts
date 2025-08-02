import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user role from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let matchRequests;
    if (dbUser.role === "athlete") {
      // Get requests received by athlete
      matchRequests = await prisma.matchRequest.findMany({
        where: { athleteId: user.id },
        include: {
          recruiter: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (dbUser.role === "recruiter") {
      // Get requests sent by recruiter
      matchRequests = await prisma.matchRequest.findMany({
        where: { recruiterId: user.id },
        include: {
          athlete: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      return NextResponse.json({ error: "Invalid user role" }, { status: 400 });
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

    const body = await request.json();
    const { recruiterId, athleteId } = body;

    // Verify the user is the recruiter making the request
    if (recruiterId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a recruiter
    const recruiter = await prisma.user.findUnique({
      where: { id: recruiterId },
    });

    if (!recruiter || recruiter.role !== "recruiter") {
      return NextResponse.json({ error: "Only recruiters can send match requests" }, { status: 403 });
    }

    // Check if athlete exists and is actually an athlete
    const athlete = await prisma.user.findUnique({
      where: { id: athleteId },
    });

    if (!athlete || athlete.role !== "athlete") {
      return NextResponse.json({ error: "Athlete not found" }, { status: 404 });
    }

    // Check if a match request already exists
    const existingRequest = await prisma.matchRequest.findFirst({
      where: {
        recruiterId,
        athleteId,
      },
    });

    if (existingRequest) {
      return NextResponse.json({ error: "Match request already sent" }, { status: 400 });
    }

    // Create the match request
    const matchRequest = await prisma.matchRequest.create({
      data: {
        recruiterId,
        athleteId,
        status: "pending",
      },
    });

    // Send real-time notification to athlete
    try {
      const socketResponse = await fetch(`${process.env.SOCKET_SERVER_URL || 'http://localhost:3001'}/api/socket/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: athleteId,
          event: 'new-match-request',
          data: {
            recruiterId,
            athleteId,
            matchRequest,
          },
        }),
      });
    } catch (error) {
      console.error('WebSocket notification failed:', error);
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