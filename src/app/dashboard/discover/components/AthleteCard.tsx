"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  currentUserId: string;
}

export default function AthleteCard({ athlete, currentUserId }: AthleteCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { addNotification } = useNotifications();

  const handleSendRequest = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/match-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recruiterId: currentUserId,
          athleteId: athlete.user.id,
        }),
      });

      if (response.ok) {
        setMessage("Match request sent successfully!");
        addNotification({
          type: "match_request",
          title: "Match Request Sent",
          message: `Request sent to ${athlete.name} successfully!`,
        });
      } else {
        const error = await response.json();
        setMessage(error.error || "Error sending request. Please try again.");
      }
    } catch (error) {
      setMessage("Error sending request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Profile Photo */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
        {athlete.imageUrl ? (
          <img 
            src={athlete.imageUrl} 
            alt={athlete.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl text-white font-bold">
              {athlete.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          {athlete.sport && (
            <span className="bg-white/90 backdrop-blur-sm text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
              {athlete.sport}
            </span>
          )}
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">{athlete.name}</CardTitle>
            {athlete.sport && (
              <p className="text-sm text-blue-600 font-medium">{athlete.sport}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {athlete.bio && (
          <div>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {athlete.bio}
            </p>
          </div>
        )}

        {athlete.achievements && (
          <div className="bg-yellow-50 p-3 rounded-lg">
            <h4 className="font-semibold text-xs text-yellow-800 mb-1 uppercase tracking-wide">🏆 Achievements</h4>
            <p className="text-xs text-yellow-700 line-clamp-2 leading-relaxed">
              {athlete.achievements}
            </p>
          </div>
        )}

        {athlete.stats && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold text-xs text-blue-800 mb-1 uppercase tracking-wide">📊 Stats</h4>
            <p className="text-xs text-blue-700 line-clamp-2 leading-relaxed">
              {athlete.stats}
            </p>
          </div>
        )}

        {message && (
          <div className={`p-2 rounded-lg text-xs ${
            message.includes("successfully") 
              ? "bg-green-100 text-green-700 border border-green-200" 
              : "bg-red-100 text-red-700 border border-red-200"
          }`}>
            {message}
          </div>
        )}

        <Button 
          onClick={handleSendRequest} 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
        >
          {isLoading ? "Sending..." : "Send Match Request"}
        </Button>
      </CardContent>
    </Card>
  );
} 