"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export function useMessageCount() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/match-request");
        if (response.ok) {
          const data = await response.json();
          const acceptedMatches = data.filter((match: { status: string }) => match.status === "accepted");
          setUnreadCount(acceptedMatches.length);
        }
      } catch (error) {
        console.error("Error fetching message count:", error);
      }
    };

    fetchUnreadCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user, isLoaded]);

  return unreadCount;
} 