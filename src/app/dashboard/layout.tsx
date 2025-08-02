"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { MessageCircle, Users, User } from "lucide-react";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import { MessageCounter } from "@/components/MessageCounter";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize real-time notifications
  useRealTimeNotifications();
  return (
    <SignedIn>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/dashboard" className="text-xl font-bold text-blue-600">
                  Talent Scout ZA
                </Link>
              </div>
              <div className="flex items-center space-x-6">
                <div className="hidden md:flex items-center space-x-4">
                  <Link 
                    href="/dashboard" 
                    className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    href="/dashboard/discover" 
                    className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
                  >
                    <Users className="w-4 h-4" />
                    <span>Discover</span>
                  </Link>
                  <Link 
                    href="/dashboard/messages" 
                    className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1 relative"
                  >
                    <MessageCounter />
                    <span>Messages</span>
                  </Link>
                  <Link 
                    href="/dashboard/requests" 
                    className="text-gray-700 hover:text-blue-600 transition-colors flex items-center space-x-1"
                  >
                    <span>Requests</span>
                  </Link>
                </div>
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-auto">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-gray-500">
              Created by Leon Jordaan
            </div>
          </div>
        </footer>
      </div>
    </SignedIn>
  );
} 