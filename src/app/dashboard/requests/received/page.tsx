"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, User, MessageCircle } from "lucide-react";
import { useNotifications } from "@/components/NotificationProvider";
import Link from "next/link";

interface MatchRequest {
  id: string;
  status: string;
  createdAt: string;
  recruiter: {
    id: string;
    profile: {
      name: string;
      bio: string | null;
      sport: string | null;
      achievements: string | null;
      stats: string | null;
      imageUrl: string | null;
    } | null;
  };
}

export default function ReceivedRequestsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [requests, setRequests] = useState<MatchRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    const checkUserRole = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) {
          if (response.status === 404) {
            router.push("/dashboard");
            return;
          }
          throw new Error(`HTTP ${response.status}`);
        }
        
        const userData = await response.json();
        
        if (userData.role !== "athlete") {
          router.push("/dashboard");
          return;
        }

        await fetchRequests();
      } catch (error) {
        console.error("Error checking user role:", error);
        router.push("/dashboard");
      }
    };

    checkUserRole();
  }, [user, isLoaded, router]);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/match-request");
      if (response.ok) {
        const data = await response.json();
        // Filter for requests received by this athlete
        const receivedRequests = data.filter((req: { athleteId: string }) => req.athleteId === user?.id);
        setRequests(receivedRequests);
      } else {
        console.error("Error fetching requests:", response.status);
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string, recruiterName: string) => {
    try {
      const response = await fetch(`/api/match-request/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "accepted",
        }),
      });

      if (response.ok) {
        addNotification({
          type: "success",
          title: "Request Accepted!",
          message: `You've accepted ${recruiterName}'s request. You can now chat!`,
        });
        // Refresh requests
        await fetchRequests();
      } else {
        const errorData = await response.json();
        addNotification({
          type: "error",
          title: "Error",
          message: errorData.error || "Failed to accept request",
        });
      }
    } catch {
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to accept request. Please try again.",
      });
    }
  };

  const handleDeclineRequest = async (requestId: string, recruiterName: string) => {
    try {
      const response = await fetch(`/api/match-request/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "declined",
        }),
      });

      if (response.ok) {
        addNotification({
          type: "success",
          title: "Request Declined",
          message: `You've declined ${recruiterName}'s request.`,
        });
        // Refresh requests
        await fetchRequests();
      } else {
        const errorData = await response.json();
        addNotification({
          type: "error",
          title: "Error",
          message: errorData.error || "Failed to decline request",
        });
      }
    } catch {
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to decline request. Please try again.",
      });
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Received Requests</h1>
        <p className="text-gray-300">
          Review and respond to match requests from recruiters
        </p>
      </div>

      {requests.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-white mb-2">No Requests Yet</h3>
            <p className="text-gray-300 mb-4">
              You haven&apos;t received any match requests from recruiters yet.
            </p>
            <p className="text-sm text-gray-400">
              Make sure your profile is complete and visible to attract recruiters!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((request) => (
            <Card key={request.id} className="bg-gray-800 border-gray-700 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white">
                      {request.recruiter.profile?.name || "Recruiter"}
                    </CardTitle>
                    <p className="text-sm text-gray-400">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {request.recruiter.profile?.bio && (
                  <p className="text-gray-300 text-sm">{request.recruiter.profile.bio}</p>
                )}
                
                {request.recruiter.profile?.achievements && (
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <h4 className="text-sm font-semibold text-white mb-1">Experience</h4>
                    <p className="text-sm text-gray-300">{request.recruiter.profile.achievements}</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  {request.status === "pending" ? (
                    <>
                      <Button
                        onClick={() => handleAcceptRequest(request.id, request.recruiter.profile?.name || "Recruiter")}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleDeclineRequest(request.id, request.recruiter.profile?.name || "Recruiter")}
                        variant="outline"
                        className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                    </>
                  ) : request.status === "accepted" ? (
                    <div className="flex items-center space-x-2 text-green-400">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Accepted</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-red-400">
                      <X className="w-4 h-4" />
                      <span className="text-sm font-medium">Declined</span>
                    </div>
                  )}
                </div>

                {request.status === "accepted" && (
                  <Link href="/dashboard/messages">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Start Chat
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 