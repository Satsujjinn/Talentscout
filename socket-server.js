const { createServer } = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store user socket mappings
const userSockets = new Map();
const matchRooms = new Map();

io.use((socket, next) => {
  const userId = socket.handshake.auth.userId;
  if (!userId) {
    return next(new Error('Authentication error'));
  }
  socket.userId = userId;
  next();
});

io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected`);
  
  // Store user socket mapping
  userSockets.set(socket.userId, socket.id);

  // Join user to their personal room for notifications
  socket.join(`user:${socket.userId}`);

  // Handle joining match rooms
  socket.on('join-match', async ({ matchId }) => {
    try {
      // Verify user is part of this match
      const match = await prisma.matchRequest.findUnique({
        where: { id: matchId },
        include: {
          athlete: true,
          recruiter: true,
        },
      });

      if (!match || (match.athleteId !== socket.userId && match.recruiterId !== socket.userId)) {
        socket.emit('error', { message: 'Unauthorized to join this match' });
        return;
      }

      socket.join(`match:${matchId}`);
      matchRooms.set(socket.id, matchId);
      console.log(`User ${socket.userId} joined match ${matchId}`);
    } catch (error) {
      console.error('Error joining match:', error);
      socket.emit('error', { message: 'Error joining match' });
    }
  });

  // Handle leaving match rooms
  socket.on('leave-match', ({ matchId }) => {
    socket.leave(`match:${matchId}`);
    matchRooms.delete(socket.id);
    console.log(`User ${socket.userId} left match ${matchId}`);
  });

  // Handle sending messages
  socket.on('send-message', async ({ matchId, message }) => {
    try {
      // Verify user is part of this match
      const match = await prisma.matchRequest.findUnique({
        where: { id: matchId },
      });

      if (!match || (match.athleteId !== socket.userId && match.recruiterId !== socket.userId)) {
        socket.emit('error', { message: 'Unauthorized to send message' });
        return;
      }

      // Save message to database
      const savedMessage = await prisma.message.create({
        data: {
          content: message.content,
          matchId: matchId,
          senderId: socket.userId,
        },
        include: {
          sender: true,
        },
      });

      // Broadcast message to all users in the match room
      io.to(`match:${matchId}`).emit(`message:${matchId}`, savedMessage);

      // Send notification to the other user
      const otherUserId = match.athleteId === socket.userId ? match.recruiterId : match.athleteId;
      io.to(`user:${otherUserId}`).emit('new-message', {
        matchId,
        message: savedMessage,
      });

    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Error sending message' });
    }
  });

  // Handle typing indicators
  socket.on('typing', ({ matchId, userId, isTyping }) => {
    // Verify user is part of this match
    socket.join(`match:${matchId}`);
    socket.to(`match:${matchId}`).emit(`typing:${matchId}`, { userId, isTyping });
  });

  // Handle match request notifications
  socket.on('match-request-sent', async ({ recruiterId, athleteId }) => {
    try {
      // Send notification to athlete
      io.to(`user:${athleteId}`).emit('new-match-request', {
        recruiterId,
        athleteId,
      });
    } catch (error) {
      console.error('Error sending match request notification:', error);
    }
  });

  // Handle match request status updates
  socket.on('match-request-updated', async ({ matchId, status }) => {
    try {
      const match = await prisma.matchRequest.findUnique({
        where: { id: matchId },
        include: {
          athlete: true,
          recruiter: true,
        },
      });

      if (match) {
        // Notify both users about the status change
        io.to(`user:${match.athleteId}`).emit('match-request-status-updated', {
          matchId,
          status,
        });
        io.to(`user:${match.recruiterId}`).emit('match-request-status-updated', {
          matchId,
          status,
        });
      }
    } catch (error) {
      console.error('Error updating match request status:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
    userSockets.delete(socket.userId);
    matchRooms.delete(socket.id);
  });
});

// API endpoint to send notifications from the main app
const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/socket/notify', (req, res) => {
  const { userId, event, data } = req.body;
  
  if (userSockets.has(userId)) {
    io.to(`user:${userId}`).emit(event, data);
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'User not connected' });
  }
});

const PORT = process.env.SOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Socket server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('Process terminated');
  });
}); 