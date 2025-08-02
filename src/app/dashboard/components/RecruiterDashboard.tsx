"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, FileText, TrendingUp, Eye, Users, Clock } from "lucide-react";

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
    recentActivity: [],
  });


  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        // Fetch match requests sent by this recruiter
        const requestsResponse = await fetch("/api/match-request");
        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json();
          const sentRequests = requestsData.filter((req: { recruiterId: string }) => req.recruiterId === user.id);
          
          // Fetch athletes data
          await fetch("/api/athletes");
          
          setStats({
            athletesViewed: Math.floor(Math.random() * 100) + 20, // Mock data
            requestsSent: sentRequests.length,
            activeChats: Math.floor(Math.random() * 8), // Mock data
            recentActivity: [
              {
                id: "1",
                type: "request_sent",
                message: "Sent match request to John Smith",
                timestamp: "2 hours ago",
              },
              {
                id: "2", 
                type: "profile_viewed",
                message: "Viewed Sarah Johnson's profile",
                timestamp: "4 hours ago",
              },
            ],
          });
        }
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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