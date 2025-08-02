"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface MatchRequestCardProps {
  request: {
    id: string;
    status: string;
    createdAt: string;
    athlete: {
      id: string;
      profile: {
        name: string;
        sport: string | null;
        imageUrl: string | null;
      } | null;
    };
  };
}

export default function MatchRequestCard({ request }: MatchRequestCardProps) {
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
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {request.athlete.profile?.imageUrl ? (
              <Image 
                src={request.athlete.profile.imageUrl} 
                alt={request.athlete.profile.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-lg">
                {request.athlete.profile?.name.charAt(0).toUpperCase() || 'A'}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold truncate">
              {request.athlete.profile?.name || 'Unknown Athlete'}
            </CardTitle>
            {request.athlete.profile?.sport && (
              <p className="text-sm text-blue-600 font-medium">
                {request.athlete.profile.sport}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
          {getStatusText(request.status)}
        </div>
        
        <div className="text-xs text-gray-500">
          Sent on {formatDate(request.createdAt)}
        </div>

        {request.status === "accepted" && (
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-xs text-green-700">
              🎉 This athlete accepted your request! You can now start messaging.
            </p>
          </div>
        )}

        {request.status === "declined" && (
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="text-xs text-red-700">
              ❌ This athlete declined your request.
            </p>
          </div>
        )}

        {request.status === "pending" && (
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-xs text-yellow-700">
              ⏳ Waiting for athlete to respond to your request.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 