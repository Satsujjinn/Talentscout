"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold-600 mx-auto mb-4"></div>
          <p className="text-warm-brown-700">Loading dashboard...</p>
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
      <div className="bg-gradient-to-r from-accent-gold-50 to-cream-100 rounded-lg p-6 border border-cream-300">
        <h1 className="text-3xl font-bold text-warm-brown-900 mb-2">
          Welcome back, {user?.firstName || "User"}!
        </h1>
        <p className="text-warm-brown-700">
          {userRole === "recruiter" 
            ? "Discover talented athletes and build your team."
            : "Connect with recruiters and showcase your talent."
          }
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/discover">
          <Card className="hover:shadow-md transition-shadow cursor-pointer bg-cream-50 border-cream-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-accent-gold-100">
                  <Search className="w-5 h-5 text-accent-gold-600" />
                </div>
                <CardTitle className="text-lg text-warm-brown-900">Discover</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-warm-brown-700">
                {userRole === "recruiter" 
                  ? "Find talented athletes"
                  : "Browse opportunities"
                }
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/messages">
          <Card className="hover:shadow-md transition-shadow cursor-pointer bg-cream-50 border-cream-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-accent-gold-100">
                  <MessageCircle className="w-5 h-5 text-accent-gold-600" />
                </div>
                <CardTitle className="text-lg text-warm-brown-900">Messages</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-warm-brown-700">View your conversations</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/requests">
          <Card className="hover:shadow-md transition-shadow cursor-pointer bg-cream-50 border-cream-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-accent-gold-100">
                  <FileText className="w-5 h-5 text-accent-gold-600" />
                </div>
                <CardTitle className="text-lg text-warm-brown-900">Requests</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-warm-brown-700">
                {userRole === "recruiter" 
                  ? "Manage your requests"
                  : "Review incoming requests"
                }
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/profile">
          <Card className="hover:shadow-md transition-shadow cursor-pointer bg-cream-50 border-cream-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-accent-gold-100">
                  <User className="w-5 h-5 text-accent-gold-600" />
                </div>
                <CardTitle className="text-lg text-warm-brown-900">Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-warm-brown-700">Update your profile</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Section */}
      {userRole === "recruiter" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-cream-50 border-cream-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-accent-gold-100">
                  <Users className="w-5 h-5 text-accent-gold-600" />
                </div>
                <CardTitle className="text-lg text-warm-brown-900">Total Athletes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-warm-brown-900">
                {stats.totalAthletes || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-cream-50 border-cream-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-accent-gold-100">
                  <FileText className="w-5 h-5 text-accent-gold-600" />
                </div>
                <CardTitle className="text-lg text-warm-brown-900">Pending Requests</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-warm-brown-900">
                {stats.pendingRequests || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-cream-50 border-cream-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-accent-gold-100">
                  <TrendingUp className="w-5 h-5 text-accent-gold-600" />
                </div>
                <CardTitle className="text-lg text-warm-brown-900">Active Matches</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-warm-brown-900">
                {stats.activeMatches || 0}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 