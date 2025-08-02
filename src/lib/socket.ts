import { io, Socket } from 'socket.io-client';

class SocketManager {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId: string) {
    if (this.socket?.connected) return;

    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        userId,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.handleReconnect();
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.socket?.connect();
      }, 1000 * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  subscribeToMessages(matchId: string, callback: (message: { id: string; content: string; createdAt: string; sender: { id: string } }) => void) {
    if (!this.socket) return;

    this.socket.emit('join-match', { matchId });
    this.socket.on(`message:${matchId}`, callback);
  }

  unsubscribeFromMessages(matchId: string) {
    if (!this.socket) return;

    this.socket.emit('leave-match', { matchId });
    this.socket.off(`message:${matchId}`);
  }

  subscribeToMatchRequests(callback: (request: { id: string; status: string }) => void) {
    if (!this.socket) return;

    this.socket.on('match-request', callback);
  }

  unsubscribeFromMatchRequests() {
    if (!this.socket) return;

    this.socket.off('match-request');
  }

  sendMessage(matchId: string, message: { content: string }) {
    if (!this.socket) return;

    this.socket.emit('send-message', { matchId, message });
  }

  getConnectionStatus() {
    return this.isConnected;
  }

  getSocket() {
    return this.socket;
  }
}

export const socketManager = new SocketManager(); 