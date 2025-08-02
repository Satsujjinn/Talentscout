"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, User } from "lucide-react";
import Image from "next/image";
import { useNotifications } from "@/components/NotificationProvider";

interface AthleteCardProps {
  athlete: {
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
}

export default function AthleteCard({ athlete }: AthleteCardProps) {
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
          athleteId: athlete.user.id,
          message: `Hi ${athlete.name}, I'm interested in connecting with you!`,
        }),
      });

      if (response.ok) {
        addNotification({
          type: "success",
          title: "Request Sent",
          message: `Match request sent to ${athlete.name}!`,
        });
      } else {
        const errorData = await response.json();
        addNotification({
          type: "error",
          title: "Error",
          message: errorData.error || "Failed to send request",
        });
      }
    } catch (error) {
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
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-cream-300">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-cream-200 border-2 border-accent-gold-200">
            {athlete.imageUrl ? (
              <Image
                src={athlete.imageUrl}
                alt={athlete.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-8 h-8 text-warm-brown-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg text-warm-brown-900">{athlete.name}</CardTitle>
            {athlete.sport && (
              <p className="text-sm text-accent-gold-700 font-medium">{athlete.sport}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {athlete.bio && (
          <p className="text-sm text-warm-brown-700 line-clamp-3 leading-relaxed">{athlete.bio}</p>
        )}
        
        {athlete.achievements && (
          <div>
            <h4 className="text-sm font-semibold text-warm-brown-900 mb-1">Achievements</h4>
            <p className="text-sm text-warm-brown-600 line-clamp-2 leading-relaxed">{athlete.achievements}</p>
          </div>
        )}
        
        {athlete.stats && (
          <div>
            <h4 className="text-sm font-semibold text-warm-brown-900 mb-1">Stats</h4>
            <p className="text-sm text-warm-brown-600 line-clamp-2 leading-relaxed">{athlete.stats}</p>
          </div>
        )}
        
        <Button
          onClick={handleSendRequest}
          disabled={isSending}
          className="w-full bg-accent-gold-600 hover:bg-accent-gold-700 text-white"
          size="sm"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          {isSending ? "Sending..." : "Send Request"}
        </Button>
      </CardContent>
    </Card>
  );
} 