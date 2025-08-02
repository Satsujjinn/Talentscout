import { io, Socket } from 'socket.io-client';

type MessageCallback = (message: { id: string; content: string; createdAt: string; sender: { id: string } }) => void;
type MatchRequestCallback = (request: { id: string; status: string }) => void;

class SocketManager {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageCallbacks = new Map<string, MessageCallback>();
  private matchRequestCallbacks = new Map<string, MatchRequestCallback>();

  connect(userId: string) {
    if (this.socket?.connected) return;

    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        userId,
      },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: false, // We'll handle reconnection manually
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
    });

    this.socket.on('connect_error', () => {
      this.isConnected = false;
      this.handleReconnect();
    });

    this.socket.on('error', (error) => {
      // Handle socket errors gracefully
      console.warn('Socket error:', error);
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 10000);
      
      this.reconnectTimeout = setTimeout(() => {
        if (this.socket) {
          this.socket.connect();
        }
      }, delay);
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
    
    // Clear all callbacks
    this.messageCallbacks.clear();
    this.matchRequestCallbacks.clear();
  }

  subscribeToMessages(matchId: string, callback: MessageCallback) {
    if (!this.socket) return;

    this.socket.emit('join-match', { matchId });
    this.socket.on(`message:${matchId}`, callback);
    this.messageCallbacks.set(matchId, callback);
  }

  unsubscribeFromMessages(matchId: string) {
    if (!this.socket) return;

    this.socket.emit('leave-match', { matchId });
    this.socket.off(`message:${matchId}`);
    this.messageCallbacks.delete(matchId);
  }

  subscribeToMatchRequests(callback: MatchRequestCallback) {
    if (!this.socket) return;

    this.socket.on('match-request', callback);
    this.matchRequestCallbacks.set('match-request', callback);
  }

  unsubscribeFromMatchRequests() {
    if (!this.socket) return;

    this.socket.off('match-request');
    this.matchRequestCallbacks.delete('match-request');
  }

  sendMessage(matchId: string, message: { content: string }) {
    if (!this.socket || !this.isConnected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('send-message', { matchId, message });
  }

  getConnectionStatus() {
    return this.isConnected && this.socket?.connected;
  }

  getSocket() {
    return this.socket;
  }

  // Method to check if socket is ready for communication
  isReady() {
    return this.socket?.connected && this.isConnected;
  }
}

export const socketManager = new SocketManager(); 