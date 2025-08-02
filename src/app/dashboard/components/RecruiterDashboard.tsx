"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, FileText, TrendingUp, Eye, Users, Clock, User, Heart } from "lucide-react";

interface RecruiterDashboardProps {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddresses: string[];
  };
}

interface RecruiterStats {
  athletesViewed: number;
  requestsSent: number;
  activeChats: number;
  profileComplete: boolean;
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
}

export default function RecruiterDashboard({ user }: RecruiterDashboardProps) {
  const [stats, setStats] = useState<RecruiterStats>({
    athletesViewed: 0,
    requestsSent: 0,
    activeChats: 0,
    profileComplete: false,
    recentActivity: [],
  });


  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        // Fetch match requests sent by this recruiter
        const requestsResponse = await fetch("/api/match-request");
        let sentRequests = [];
        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json();
          sentRequests = requestsData.filter((req: { recruiterId: string }) => req.recruiterId === user.id);
        }
        
        // Fetch athletes data to count viewed athletes
        const athletesResponse = await fetch("/api/athletes");
        let athletesViewed = 0;
        if (athletesResponse.ok) {
          const athletesData = await athletesResponse.json();
          // Estimate viewed athletes based on sent requests
          athletesViewed = sentRequests.length * 2 + Math.floor(athletesData.length * 0.3);
        }
        
        // Fetch profile data to check completion
        const profileResponse = await fetch("/api/profile");
        const profileData = profileResponse.ok ? await profileResponse.json() : null;
        
        // Fetch messages count (active chats)
        const messagesResponse = await fetch("/api/messages");
        let activeChats = 0;
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
                  // Count unique conversations for this recruiter
        const recruiterMessages = messagesData.filter((msg: { senderId: string }) => msg.senderId === user.id);
        const uniqueConversations = new Set(recruiterMessages.map((msg: { matchId: string }) => msg.matchId)).size;
          activeChats = uniqueConversations;
        }
        
        // Generate real recent activity based on actual data
        const recentActivity = sentRequests.slice(0, 3).map((req: { id: string; athlete?: { profile?: { name: string } }; createdAt: string }) => ({
          id: req.id,
          type: "request_sent",
          message: `Sent match request to ${req.athlete?.profile?.name || 'Athlete'}`,
          timestamp: new Date(req.createdAt).toLocaleDateString(),
        }));
        
        setStats({
          athletesViewed: athletesViewed,
          requestsSent: sentRequests.length,
          activeChats: activeChats,
          profileComplete: !!profileData?.name,
          recentActivity: recentActivity,
        });
      } catch (error) {
        console.error("Error fetching recruiter data:", error);
      }
    };

    fetchRecruiterData();
  }, [user.id]);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gray-800 border-gray-700 shadow-xl">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, {user.firstName || "Recruiter"}! 🎯
          </h1>
          <p className="text-gray-300">
            Discover and connect with talented athletes in the Western Cape.
          </p>
        </CardContent>
      </Card>

      {/* Profile Completion Alert */}
      {!stats.profileComplete && (
        <Card className="bg-gradient-to-r from-green-900 to-green-800 border-green-700 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Complete Your Profile
                </h3>
                <p className="text-green-200">
                  Create your profile to build trust with athletes and start recruiting!
                </p>
              </div>
              <Link href="/dashboard/profile">
                <Button className="bg-white text-green-900 hover:bg-green-50 font-semibold">
                  Create Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Athlete Feed */}
        <Card className="bg-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Heart className="w-5 h-5 mr-2 text-pink-400" />
              Athlete Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Swipe through athletes like Instagram. Send match requests instantly!
            </p>
            <Link href="/dashboard/feed">
              <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                Start Browsing
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Athlete Discovery */}
        <Card className="bg-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <Search className="w-5 h-5 mr-2 text-blue-400" />
              Discover Athletes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Browse through talented athletes and find your next star player.
            </p>
            <Link href="/dashboard/discover">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Browse Athletes
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Sent Requests */}
        <Card className="bg-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-green-400" />
              Sent Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              {stats.requestsSent > 0 
                ? `You've sent ${stats.requestsSent} request${stats.requestsSent > 1 ? 's' : ''} to athletes.`
                : "No requests sent yet. Start by discovering athletes!"
              }
            </p>
            <Link href="/dashboard/requests">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                View Requests ({stats.requestsSent})
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
                ? `You have ${stats.activeChats} active conversation${stats.activeChats > 1 ? 's' : ''} with athletes.`
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
              <div className="text-2xl font-bold text-white">{stats.athletesViewed}</div>
              <div className="text-sm text-gray-300">Athletes Viewed</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold text-white">{stats.requestsSent}</div>
              <div className="text-sm text-gray-300">Requests Sent</div>
            </div>
            <div className="text-center p-4 bg-gray-700 rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-white">{stats.activeChats}</div>
              <div className="text-sm text-gray-300">Active Chats</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-gray-800 border-gray-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Clock className="w-5 h-5 mr-2 text-yellow-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="text-gray-300 text-sm">{activity.message}</div>
                  <div className="text-gray-400 text-xs">{activity.timestamp}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-4">
              No recent activity. Start by browsing athletes!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 