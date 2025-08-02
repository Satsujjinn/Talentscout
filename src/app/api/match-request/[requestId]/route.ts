import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !["accepted", "declined"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { requestId } = await params;

    // Get the match request
    const matchRequest = await prisma.matchRequest.findUnique({
      where: { id: requestId },
      include: {
        athlete: true,
        recruiter: true,
      },
    });

    if (!matchRequest) {
      return NextResponse.json({ error: "Match request not found" }, { status: 404 });
    }

    // Only the athlete can accept/decline the request
    if (matchRequest.athleteId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow updates if the request is pending
    if (matchRequest.status !== "pending") {
      return NextResponse.json({ error: "Request already processed" }, { status: 400 });
    }

    // Update the match request status
    const updatedRequest = await prisma.matchRequest.update({
      where: { id: requestId },
      data: { status },
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

    // Send real-time notification to both users
    try {
      await fetch(`${process.env.SOCKET_SERVER_URL || 'http://localhost:3001'}/api/socket/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: matchRequest.recruiterId,
          event: 'match-request-status-updated',
          data: {
            matchId: requestId,
            status,
            updatedRequest,
          },
        }),
      });
    } catch (error) {
      console.error('WebSocket notification failed:', error);
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error updating match request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 