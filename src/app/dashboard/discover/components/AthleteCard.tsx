"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, User } from "lucide-react";
import Image from "next/image";
import { useNotifications } from "@/components/NotificationProvider";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    bio: string | null;
    sport: string | null;
    achievements: string | null;
    stats: string | null;
    imageUrl: string | null;
    user: {
      id: string;
    };
  };
  userRole?: string;
}

export default function UserCard({ user: profileUser, userRole }: UserCardProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const { addNotification } = useNotifications();

  const handleSendRequest = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/match-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          athleteId: profileUser.user.id,
          message: `Hi ${profileUser.name}, I'm interested in connecting with you!`,
        }),
      });

      if (response.ok) {
        addNotification({
          type: "success",
          title: "Request Sent",
          message: `Match request sent to ${profileUser.name}!`,
        });
      } else {
        const errorData = await response.json();
        addNotification({
          type: "error",
          title: "Error",
          message: errorData.error || "Failed to send request",
        });
      }
    } catch {
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to send request. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gray-800 border-gray-700 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-700 border-2 border-blue-500">
            {profileUser.imageUrl ? (
              <Image
                src={profileUser.imageUrl}
                alt={profileUser.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg text-white">{profileUser.name}</CardTitle>
            {profileUser.sport && (
              <p className="text-sm text-blue-400 font-medium">{profileUser.sport}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {profileUser.bio && (
          <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">{profileUser.bio}</p>
        )}
        
        {profileUser.achievements && (
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">Achievements</h4>
            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{profileUser.achievements}</p>
          </div>
        )}
        
        {profileUser.stats && (
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">Stats</h4>
            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{profileUser.stats}</p>
          </div>
        )}
        
        {userRole === "recruiter" && (
          <Button
            onClick={handleSendRequest}
            disabled={isSending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            size="sm"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {isSending ? "Sending..." : "Send Request"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 