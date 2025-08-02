"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { MessageCircle, Send, User, Wifi, WifiOff } from "lucide-react";
import { useNotifications } from "@/components/NotificationProvider";
import { socketManager } from "@/lib/socket";
import { TypingIndicator, useTypingIndicator } from "@/components/TypingIndicator";

type MatchRequest = {
  id: string;
  status: string;
  createdAt: string;
  athlete: {
    id: string;
    profile?: {
      name: string;
      sport?: string;
      imageUrl?: string;
    };
  };
  recruiter: {
    id: string;
    profile?: {
      name: string;
      sport?: string;
      imageUrl?: string;
    };
  };
};

type Message = {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
  };
};

export default function MessagesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [acceptedMatches, setAcceptedMatches] = useState<MatchRequest[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchRequest | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { addNotification } = useNotifications();
  const { emitTyping } = useTypingIndicator(selectedMatch?.id || "", user?.id || "");

  // Memoize getOtherUser function to prevent unnecessary re-renders
  const getOtherUser = useCallback((match: MatchRequest) => {
    if (!user) return null;
    return match.athlete.id === user.id ? match.recruiter : match.athlete;
  }, [user]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    // Connect to WebSocket
    socketManager.connect(user.id);
    setIsConnected(socketManager.getConnectionStatus());

    fetchAcceptedMatches();

    // Cleanup on unmount
    return () => {
      socketManager.disconnect();
    };
  }, [user, isLoaded, router]);

  useEffect(() => {
    if (selectedMatch) {
      fetchMessages(selectedMatch.id);
      
      // Subscribe to real-time messages for this match
      socketManager.subscribeToMessages(selectedMatch.id, (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
        addNotification({
          type: "message",
          title: "New Message",
          message: `New message from ${getOtherUser(selectedMatch)?.profile?.name || "Unknown User"}`,
        });
      });

      return () => {
        socketManager.unsubscribeFromMessages(selectedMatch.id);
      };
    }
  }, [selectedMatch, addNotification, getOtherUser]);

  const fetchAcceptedMatches = async () => {
    try {
      const response = await fetch("/api/match-request");
      if (response.ok) {
        const data = await response.json();
        const accepted = data.filter((match: MatchRequest) => match.status === "accepted");
        setAcceptedMatches(accepted);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (matchId: string) => {
    try {
      const response = await fetch(`/api/messages?matchRequestId=${matchId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!selectedMatch || !newMessage.trim()) return;

    setIsSending(true);
    try {
      // Send via WebSocket for real-time delivery
      socketManager.sendMessage(selectedMatch.id, {
        content: newMessage.trim(),
      });

      // Also save to database via API
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchRequestId: selectedMatch.id,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        setNewMessage("");
        addNotification({
          type: "message",
          title: "Message Sent",
          message: "Your message has been sent successfully!",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center py-16">
          <div className="text-warm-brown-500 text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <h1 className="text-4xl font-bold text-warm-brown-900">
            Messages
          </h1>
          <div className="flex items-center space-x-1">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>
        <p className="text-warm-brown-700 text-lg">
          Chat with your accepted matches
        </p>
        {!isConnected && (
          <p className="text-sm text-orange-600 mt-2">
            Connecting to real-time messaging...
          </p>
        )}
      </div>

      {acceptedMatches.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-warm-brown-500 text-xl mb-4">
            No accepted matches yet
          </div>
          <p className="text-warm-brown-400 mb-6">
            You'll be able to chat here once you accept match requests from recruiters or athletes accept your requests. 
            Start by browsing athletes and sending match requests!
          </p>
          <div className="text-sm text-warm-brown-500">
            <p>Matches appear here when both parties accept a connection request.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Matches List */}
          <div className="bg-cream-50 rounded-lg shadow-md border border-cream-300">
            <div className="p-4 border-b border-cream-300">
              <h3 className="font-semibold text-warm-brown-900">Your Matches</h3>
            </div>
            <div className="overflow-y-auto h-[500px]">
              {acceptedMatches.map((match) => {
                const otherUser = getOtherUser(match);
                return (
                  <div
                    key={match.id}
                    onClick={() => setSelectedMatch(match)}
                    className={`p-4 border-b border-cream-300 cursor-pointer hover:bg-cream-100 transition-colors ${
                      selectedMatch?.id === match.id ? "bg-accent-gold-50 border-accent-gold-300" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent-gold-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-accent-gold-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-warm-brown-900 truncate">
                          {otherUser?.profile?.name || "Unknown User"}
                        </p>
                        <p className="text-sm text-warm-brown-600">
                          {otherUser?.profile?.sport || "Athlete"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-cream-50 rounded-lg shadow-md border border-cream-300">
            {selectedMatch ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-cream-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent-gold-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-accent-gold-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-warm-brown-900">
                        {getOtherUser(selectedMatch)?.profile?.name || "Unknown User"}
                      </h3>
                      <p className="text-sm text-warm-brown-600">
                        {getOtherUser(selectedMatch)?.profile?.sport || "Athlete"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto h-[400px] p-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-warm-brown-500">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender.id === user?.id ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.sender.id === user?.id
                                ? "bg-accent-gold-600 text-white"
                                : "bg-cream-200 text-warm-brown-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender.id === user?.id ? "text-accent-gold-100" : "text-warm-brown-500"
                            }`}>
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-cream-300">
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          emitTyping(e.target.value.length > 0);
                        }}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        onBlur={() => emitTyping(false)}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-warm-brown-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-gold-500 focus:border-transparent bg-cream-50 text-warm-brown-900"
                        disabled={isSending}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || isSending}
                        className="px-4 py-2 bg-accent-gold-600 text-white rounded-md hover:bg-accent-gold-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    <TypingIndicator matchId={selectedMatch.id} currentUserId={user?.id || ""} />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-warm-brown-400 mx-auto mb-4" />
                  <p className="text-warm-brown-600">Select a match to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 