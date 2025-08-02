"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Search, MessageCircle, FileText, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalAthletes?: number;
  totalRecruiters?: number;
  pendingRequests?: number;
  activeMatches?: number;
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    const checkUserRole = async () => {
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          const userData = await response.json();
          setUserRole(userData.role);
          
          // Fetch dashboard stats based on role
          if (userData.role === "recruiter") {
            // For recruiters, show athlete stats
            const statsResponse = await fetch("/api/athletes");
            if (statsResponse.ok) {
              const athletes = await statsResponse.json();
              setStats({
                totalAthletes: athletes.length,
                pendingRequests: 0, // You can implement this
                activeMatches: 0, // You can implement this
              });
            }
          } else {
            // For athletes, show recruiter stats
            setStats({
              totalRecruiters: 0, // You can implement this
              pendingRequests: 0, // You can implement this
              activeMatches: 0, // You can implement this
            });
          }
        } else if (response.status === 404) {
          // User not found in database, redirect to dashboard for role selection
          router.push("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [user, isLoaded, router]);

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e4a91a] mx-auto mb-4"></div>
          <p className="text-[#6a5a3f]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userRole) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#fefdf8] to-[#fdfcf9] rounded-lg p-6 border border-[#f5f1e6]">
        <h1 className="text-3xl font-bold text-[#6a5a3f] mb-2">
          Welcome back, {user.firstName || "User"}!
        </h1>
        <p className="text-[#9a8558]">
          {userRole === "recruiter" 
            ? "Discover talented athletes and build your team."
            : "Connect with recruiters and showcase your talent."
          }
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/discover">
          <Card className="hover:shadow-md transition-shadow cursor-pointer bg-[#fefefe] border-[#f5f1e6]">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-[#fef9e6]">
                  <Search className="w-5 h-5 text-[#e4a91a]" />
                </div>
                <CardTitle className="text-lg text-[#6a5a3f]">Discover</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#9a8558]">
                {userRole === "recruiter" 
                  ? "Find talented athletes"
                  : "Browse opportunities"
                }
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/messages">
          <Card className="hover:shadow-md transition-shadow cursor-pointer bg-[#fefefe] border-[#f5f1e6]">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-[#fef9e6]">
                  <MessageCircle className="w-5 h-5 text-[#e4a91a]" />
                </div>
                <CardTitle className="text-lg text-[#6a5a3f]">Messages</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#9a8558]">View your conversations</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/requests">
          <Card className="hover:shadow-md transition-shadow cursor-pointer bg-[#fefefe] border-[#f5f1e6]">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-[#fef9e6]">
                  <FileText className="w-5 h-5 text-[#e4a91a]" />
                </div>
                <CardTitle className="text-lg text-[#6a5a3f]">Requests</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#9a8558]">
                {userRole === "recruiter" 
                  ? "Manage your requests"
                  : "Review incoming requests"
                }
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/profile">
          <Card className="hover:shadow-md transition-shadow cursor-pointer bg-[#fefefe] border-[#f5f1e6]">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-[#fef9e6]">
                  <User className="w-5 h-5 text-[#e4a91a]" />
                </div>
                <CardTitle className="text-lg text-[#6a5a3f]">Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#9a8558]">Update your profile</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Section */}
      {userRole === "recruiter" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#fefefe] border-[#f5f1e6]">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-[#fef9e6]">
                  <Users className="w-5 h-5 text-[#e4a91a]" />
                </div>
                <CardTitle className="text-lg text-[#6a5a3f]">Total Athletes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#6a5a3f]">
                {stats.totalAthletes || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#fefefe] border-[#f5f1e6]">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-[#fef9e6]">
                  <FileText className="w-5 h-5 text-[#e4a91a]" />
                </div>
                <CardTitle className="text-lg text-[#6a5a3f]">Pending Requests</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#6a5a3f]">
                {stats.pendingRequests || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#fefefe] border-[#f5f1e6]">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-[#fef9e6]">
                  <TrendingUp className="w-5 h-5 text-[#e4a91a]" />
                </div>
                <CardTitle className="text-lg text-[#6a5a3f]">Active Matches</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-[#6a5a3f]">
                {stats.activeMatches || 0}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 