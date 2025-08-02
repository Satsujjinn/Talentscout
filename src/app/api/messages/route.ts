import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const matchRequestId = searchParams.get("matchRequestId");

    if (!matchRequestId) {
      return NextResponse.json({ error: "Match request ID required" }, { status: 400 });
    }

    // Verify the user is part of this match request
    const matchRequest = await prisma.matchRequest.findUnique({
      where: { id: matchRequestId },
      include: {
        athlete: true,
        recruiter: true,
      },
    });

    if (!matchRequest) {
      return NextResponse.json({ error: "Match request not found" }, { status: 404 });
    }

    if (matchRequest.athleteId !== user.id && matchRequest.recruiterId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow messages if the request is accepted
    if (matchRequest.status !== "accepted") {
      return NextResponse.json({ error: "Match request not accepted" }, { status: 403 });
    }

    // Fetch messages for this match
    const messages = await prisma.message.findMany({
      where: { matchId: matchRequestId },
      include: {
        sender: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
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
    const { matchRequestId, content } = body;

    if (!matchRequestId || !content || content.trim() === "") {
      return NextResponse.json({ error: "Match request ID and content required" }, { status: 400 });
    }

    // Verify the user is part of this match request
    const matchRequest = await prisma.matchRequest.findUnique({
      where: { id: matchRequestId },
    });

    if (!matchRequest) {
      return NextResponse.json({ error: "Match request not found" }, { status: 404 });
    }

    if (matchRequest.athleteId !== user.id && matchRequest.recruiterId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow messages if the request is accepted
    if (matchRequest.status !== "accepted") {
      return NextResponse.json({ error: "Match request not accepted" }, { status: 403 });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        matchId: matchRequestId,
        senderId: user.id,
      },
      include: {
        sender: true,
      },
    });

    // Send real-time notification via WebSocket
    try {
      const socketResponse = await fetch(`${process.env.SOCKET_SERVER_URL || 'http://localhost:3001'}/api/socket/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: matchRequest.athleteId === user.id ? matchRequest.recruiterId : matchRequest.athleteId,
          event: 'new-message',
          data: {
            matchId: matchRequestId,
            message: message,
          },
        }),
      });
    } catch (error) {
      console.error('WebSocket notification failed:', error);
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 