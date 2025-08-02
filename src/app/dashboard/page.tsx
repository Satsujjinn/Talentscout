"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AthleteDashboard from "./components/AthleteDashboard";

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
  const [stats] = useState<DashboardStats>({});
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
          
          // Dashboard stats can be implemented later
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

  // Render appropriate dashboard based on user role
  if (userRole === "athlete" && user) {
    return <AthleteDashboard user={user} />;
  } else if (userRole === "recruiter") {
    // Redirect recruiters to the feed
    router.push("/dashboard/feed");
    return null;
  }

  // Fallback for unknown roles
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-accent-gold-50 to-cream-100 rounded-lg p-6 border border-cream-300">
        <h1 className="text-3xl font-bold text-warm-brown-900 mb-2">
          Welcome back, {user?.firstName || "User"}!
        </h1>
        <p className="text-warm-brown-700">
          Please select your role to continue.
        </p>
      </div>
    </div>
  );
} 