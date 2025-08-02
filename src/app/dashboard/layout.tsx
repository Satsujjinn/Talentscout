"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Search, MessageCircle, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RoleSelection from "./components/RoleSelection";
import AthleteDashboard from "./components/AthleteDashboard";
import RecruiterDashboard from "./components/RecruiterDashboard";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useRealTimeNotifications();

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
        } else if (response.status === 404) {
          // User not found in database, show role selection
          setUserRole(null);
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
      <div className="min-h-screen bg-[#fefefe] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e4a91a] mx-auto mb-4"></div>
          <p className="text-[#6a5a3f]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Show role selection if user hasn't set their role yet
  if (userRole === null) {
    return (
      <div className="min-h-screen bg-[#fefefe] p-4">
        <RoleSelection user={user} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fefefe]">
      {/* Navigation */}
      <nav className="bg-[#fdfcf9] border-b border-[#f5f1e6] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-[#6a5a3f]">
                Talent Scout ZA
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1">
                <Link href="/dashboard/discover">
                  <Button variant="ghost" size="sm" className="text-[#6a5a3f] hover:bg-[#faf8f0]">
                    <Search className="w-4 h-4 mr-2" />
                    Discover
                  </Button>
                </Link>
                <Link href="/dashboard/messages">
                  <Button variant="ghost" size="sm" className="text-[#6a5a3f] hover:bg-[#faf8f0]">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Messages
                  </Button>
                </Link>
                <Link href="/dashboard/requests">
                  <Button variant="ghost" size="sm" className="text-[#6a5a3f] hover:bg-[#faf8f0]">
                    <FileText className="w-4 h-4 mr-2" />
                    Requests
                  </Button>
                </Link>
                <Link href="/dashboard/profile">
                  <Button variant="ghost" size="sm" className="text-[#6a5a3f] hover:bg-[#faf8f0]">
                    <Settings className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#e4a91a] flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-[#6a5a3f]">
                  {user.firstName || user.emailAddresses[0]?.emailAddress}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
} 