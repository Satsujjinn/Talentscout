"use client";

import { useState, useEffect } from 'react';
import { socketManager } from '@/lib/socket';

interface TypingIndicatorProps {
  matchId: string;
  currentUserId: string;
}

export function TypingIndicator({ matchId, currentUserId }: TypingIndicatorProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!matchId) return;

    // Listen for typing events
    socketManager.getSocket()?.on(`typing:${matchId}`, (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== currentUserId) {
        if (data.isTyping) {
          setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
        } else {
          setTypingUsers(prev => prev.filter(id => id !== data.userId));
        }
      }
    });

    return () => {
      socketManager.getSocket()?.off(`typing:${matchId}`);
    };
  }, [matchId, currentUserId]);

  useEffect(() => {
    setIsTyping(typingUsers.length > 0);
  }, [typingUsers]);

  const emitTyping = (isTyping: boolean) => {
    socketManager.getSocket()?.emit('typing', {
      matchId,
      userId: currentUserId,
      isTyping,
    });
  };

  if (!isTyping) return null;

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500 italic">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span>Someone is typing...</span>
    </div>
  );
}

export function useTypingIndicator(matchId: string, currentUserId: string) {
  const emitTyping = (isTyping: boolean) => {
    socketManager.getSocket()?.emit('typing', {
      matchId,
      userId: currentUserId,
      isTyping,
    });
  };

  return { emitTyping };
} 