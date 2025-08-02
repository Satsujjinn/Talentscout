"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MessageCircle, FileText, TrendingUp, Eye, Users } from "lucide-react";

interface AthleteDashboardProps {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddresses: { emailAddress: string }[];
  };
}

interface DashboardStats {
  profileViews: number;
  matchRequests: number;
  activeChats: number;
  profileComplete: boolean;
}

export default function AthleteDashboard({ user }: AthleteDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    profileViews: 0,
    matchRequests: 0,
    activeChats: 0,
    profileComplete: false,
  });


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch match requests count
        const requestsResponse = await fetch("/api/match-request");
        let receivedRequests = [];
        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json();
          receivedRequests = requestsData.filter((req: { athleteId: string }) => req.athleteId === user.id);
        }
        
        // Fetch profile data
        const profileResponse = await fetch("/api/profile");
        const profileData = profileResponse.ok ? await profileResponse.json() : null;
        
        // Fetch messages count (active chats)
        const messagesResponse = await fetch("/api/messages");
        let activeChats = 0;
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
                  // Count unique conversations
        const uniqueConversations = new Set(messagesData.map((msg: { matchId: string }) => msg.matchId)).size;
          activeChats = uniqueConversations;
        }
        
        // Calculate profile views based on match requests and profile completeness
        const profileViews = receivedRequests.length * 3 + (profileData?.name ? 15 : 0);
        
        setStats({
          profileViews: profileViews,
          matchRequests: receivedRequests.length,
          activeChats: activeChats,
          profileComplete: !!profileData?.name,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [user.id]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gray-800 border-gray-700 shadow-xl">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, {user.firstName || "Athlete"}! 👋
          </h1>
          <p className="text-gray-300">
            Showcase your talent and connect with recruiters in the Western Cape.
          </p>
        </CardContent>
      </Card>

      {/* Profile Completion Alert */}
      {!stats.profileComplete && (
        <Card className="bg-gradient-to-r from-blue-900 to-blue-800 border-blue-700 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Complete Your Profile
                </h3>
                <p className="text-blue-200">
                  Create your profile to be discovered by recruiters and start connecting!
                </p>
              </div>
              <Link href="/dashboard/profile">
                <Button className="bg-white text-blue-900 hover:bg-blue-50 font-semibold">
                  Create Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="bg-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-400" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              {stats.profileComplete 
                ? "Your profile is complete and visible to recruiters."
                : "Complete your profile to attract recruiters."
              }
            </p>
            <Link href="/dashboard/profile">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {stats.profileComplete ? "Update Profile" : "Complete Profile"}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Match Requests */}
        <Card className="bg-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-green-400" />
              Match Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              {stats.matchRequests > 0 
                ? `You have ${stats.matchRequests} pending request${stats.matchRequests > 1 ? 's' : ''} from recruiters.`
                : "No pending requests from recruiters yet."
              }
            </p>
            <Link href="/dashboard/requests/received">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                View Requests ({stats.matchRequests})
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="bg-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-purple-400" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              {stats.activeChats > 0 
                ? `You have ${stats.activeChats} active conversation${stats.activeChats > 1 ? 's' : ''}.`
                : "No active conversations yet."
              }
            </p>
            <Link href="/dashboard/messages">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Open Messages ({stats.activeChats})
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Stats Dashboard */}
      <Card className="bg-gray-800 border-gray-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
            Your Performance Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <Eye className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-white">{stats.profileViews}</div>
              <div className="text-sm text-gray-300">Profile Views</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold text-white">{stats.matchRequests}</div>
              <div className="text-sm text-gray-300">Match Requests</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-white">{stats.activeChats}</div>
              <div className="text-sm text-gray-300">Active Chats</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 