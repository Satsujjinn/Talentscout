"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Search, MessageCircle, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoleSelection from "./components/RoleSelection";
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
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
      <div className="min-h-screen bg-gray-900 p-4">
        <RoleSelection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-white">
                Talent Scout ZA
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1">
                <Link href="/dashboard/discover">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-gray-700 hover:text-white">
                    <Search className="w-4 h-4 mr-2" />
                    Discover
                  </Button>
                </Link>
                <Link href="/dashboard/messages">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-gray-700 hover:text-white">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Messages
                  </Button>
                </Link>
                <Link href="/dashboard/requests">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-gray-700 hover:text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    Requests
                  </Button>
                </Link>
                <Link href="/dashboard/profile">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-gray-700 hover:text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-300">
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