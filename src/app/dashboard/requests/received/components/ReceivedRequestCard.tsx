"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReceivedRequestCardProps {
  request: {
    id: string;
    status: string;
    createdAt: string;
    recruiter: {
      id: string;
      profile: {
        name: string;
        bio: string | null;
        sport: string | null;
        imageUrl: string | null;
      } | null;
    };
  };
  currentUserId: string;
}

export default function ReceivedRequestCard({ request, currentUserId }: ReceivedRequestCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(request.status);

  const handleResponse = async (newStatus: "accepted" | "declined") => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/match-request/${request.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (response.ok) {
        setStatus(newStatus);
        setMessage(`Request ${newStatus} successfully!`);
      } else {
        const error = await response.json();
        setMessage(error.error || "Error updating request. Please try again.");
      }
    } catch (error) {
      setMessage("Error updating request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "declined":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
        return "Accepted";
      case "declined":
        return "Declined";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
            {request.recruiter.profile?.imageUrl ? (
              <img 
                src={request.recruiter.profile.imageUrl} 
                alt={request.recruiter.profile.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-lg">
                {request.recruiter.profile?.name.charAt(0).toUpperCase() || 'R'}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold truncate">
              {request.recruiter.profile?.name || 'Unknown Recruiter'}
            </CardTitle>
            {request.recruiter.profile?.sport && (
              <p className="text-sm text-purple-600 font-medium">
                {request.recruiter.profile.sport}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {request.recruiter.profile?.bio && (
          <div>
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {request.recruiter.profile.bio}
            </p>
          </div>
        )}

        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
          {getStatusText(status)}
        </div>
        
        <div className="text-xs text-gray-500">
          Received on {formatDate(request.createdAt)}
        </div>

        {message && (
          <div className={`p-2 rounded-lg text-xs ${
            message.includes("successfully") 
              ? "bg-green-100 text-green-700 border border-green-200" 
              : "bg-red-100 text-red-700 border border-red-200"
          }`}>
            {message}
          </div>
        )}

        {status === "pending" && (
          <div className="flex space-x-2">
            <Button 
              onClick={() => handleResponse("accepted")} 
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              {isLoading ? "Processing..." : "Accept"}
            </Button>
            <Button 
              onClick={() => handleResponse("declined")} 
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              {isLoading ? "Processing..." : "Decline"}
            </Button>
          </div>
        )}

        {status === "accepted" && (
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs text-green-700">
              🎉 You accepted this request! You can now start messaging.
            </p>
          </div>
        )}

        {status === "declined" && (
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-xs text-red-700">
              ❌ You declined this request.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 