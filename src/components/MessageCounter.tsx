"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { socketManager } from '@/lib/socket';
import { MessageCircle } from 'lucide-react';

export function MessageCounter() {
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Connect to WebSocket
    socketManager.connect(user.id);
    setIsConnected(socketManager.getConnectionStatus() || false);

    // Fetch initial count
    fetchUnreadCount();

    // Listen for new messages
    const handleNewMessage = () => {
      setUnreadCount(prev => prev + 1);
    };

    socketManager.getSocket()?.on('new-message', handleNewMessage);

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => {
      socketManager.getSocket()?.off('new-message', handleNewMessage);
      clearInterval(interval);
    };
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/match-request');
      if (response.ok) {
        const data = await response.json();
        const acceptedMatches = data.filter((match: { status: string }) => match.status === 'accepted');
        setUnreadCount(acceptedMatches.length);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  if (!isConnected) return null;

  return (
    <div className="relative">
      <MessageCircle className="w-4 h-4" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  );
} 