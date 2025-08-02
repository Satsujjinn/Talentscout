"use client";

import { useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { socketManager } from '@/lib/socket';
import { useNotifications } from '@/components/NotificationProvider';

export function useRealTimeNotifications() {
  const { user } = useUser();
  const { addNotification } = useNotifications();

  const handleNewMessage = useCallback((data: { message: { sender?: { firstName?: string } } }) => {
    addNotification({
      type: 'message',
      title: 'New Message',
      message: `You have a new message from ${data.message.sender?.firstName || 'Someone'}`,
    });
  }, [addNotification]);

  const handleNewMatchRequest = useCallback(() => {
    addNotification({
      type: 'match_request',
      title: 'New Match Request',
      message: 'You have received a new match request from a recruiter!',
    });
  }, [addNotification]);

  const handleMatchRequestStatusUpdate = useCallback((data: { status: string }) => {
    const statusText = data.status === 'accepted' ? 'accepted' : 'declined';
    addNotification({
      type: 'match_request',
      title: 'Match Request Updated',
      message: `Your match request has been ${statusText}!`,
    });
  }, [addNotification]);

  useEffect(() => {
    if (!user) return;

    // Connect to WebSocket
    socketManager.connect(user.id);

    // Listen for real-time events
    socketManager.getSocket()?.on('new-message', handleNewMessage);
    socketManager.getSocket()?.on('new-match-request', handleNewMatchRequest);
    socketManager.getSocket()?.on('match-request-status-updated', handleMatchRequestStatusUpdate);

    return () => {
      socketManager.getSocket()?.off('new-message', handleNewMessage);
      socketManager.getSocket()?.off('new-match-request', handleNewMatchRequest);
      socketManager.getSocket()?.off('match-request-status-updated', handleMatchRequestStatusUpdate);
    };
  }, [user, handleNewMessage, handleNewMatchRequest, handleMatchRequestStatusUpdate]);

  return {
    isConnected: socketManager.getConnectionStatus(),
  };
} 