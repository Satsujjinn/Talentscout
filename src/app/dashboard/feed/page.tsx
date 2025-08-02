"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, User, Trophy, Target } from "lucide-react";
import Image from "next/image";
import { useNotifications } from "@/components/NotificationProvider";

interface AthleteCard {
  id: string;
  name: string;
  bio: string | null;
  sport: string | null;
  achievements: string | null;
  stats: string | null;
  imageUrl: string | null;
  user: {
    id: string;
  };
}

export default function FeedPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [athletes, setAthletes] = useState<AthleteCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    // Check if user is a recruiter
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
        
        if (!userData || userData.role !== "recruiter") {
          router.push("/dashboard");
          return;
        }

        // Fetch athletes for the feed
        await fetchAthletes();
      } catch (error) {
        console.error("Error checking user role:", error);
        router.push("/dashboard");
      }
    };

    checkUserRole();
  }, [user, isLoaded, router]);

  const fetchAthletes = async () => {
    try {
      const response = await fetch("/api/athletes");
      if (response.ok) {
        const data = await response.json();
        setAthletes(data);
      } else {
        console.error("Error fetching athletes:", response.status);
        setAthletes([]);
      }
    } catch (error) {
      console.error("Error fetching athletes:", error);
      setAthletes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (currentIndex >= athletes.length) return;
    
    setIsSendingRequest(true);
    const athlete = athletes[currentIndex];

    try {
      const response = await fetch("/api/match-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          athleteId: athlete.user.id,
        }),
      });

      if (response.ok) {
        addNotification({
          type: "success",
          title: "Match Request Sent!",
          message: `Request sent to ${athlete.name}! They'll be notified.`,
        });
        // Move to next athlete
        setCurrentIndex(prev => prev + 1);
      } else {
        const errorData = await response.json();
        addNotification({
          type: "error",
          title: "Error",
          message: errorData.error || "Failed to send request",
        });
      }
    } catch {
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to send request. Please try again.",
      });
    } finally {
      setIsSendingRequest(false);
    }
  };

  const handleSkip = () => {
    setCurrentIndex(prev => prev + 1);
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading athletes...</p>
        </div>
      </div>
    );
  }

  if (currentIndex >= athletes.length) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No More Athletes</h2>
          <p className="text-gray-300 mb-6">
            You&apos;ve seen all available athletes. Check back later for new profiles!
          </p>
          <Button 
            onClick={() => setCurrentIndex(0)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  const currentAthlete = athletes[currentIndex];

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{currentIndex + 1} of {athletes.length}</span>
          <span>{Math.round(((currentIndex + 1) / athletes.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / athletes.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Athlete Card */}
      <Card className="bg-gray-800 border-gray-700 shadow-xl overflow-hidden">
        {/* Image Section */}
        <div className="relative h-64 bg-gray-700">
          {currentAthlete.imageUrl ? (
            <Image
              src={currentAthlete.imageUrl}
              alt={currentAthlete.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-1">{currentAthlete.name}</h2>
            {currentAthlete.sport && (
              <p className="text-blue-400 font-medium">{currentAthlete.sport}</p>
            )}
          </div>

          {currentAthlete.bio && (
            <p className="text-gray-300 mb-4 leading-relaxed">{currentAthlete.bio}</p>
          )}

          {currentAthlete.achievements && (
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Trophy className="w-4 h-4 text-yellow-400 mr-2" />
                <h3 className="text-sm font-semibold text-white">Achievements</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{currentAthlete.achievements}</p>
            </div>
          )}

          {currentAthlete.stats && (
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Target className="w-4 h-4 text-green-400 mr-2" />
                <h3 className="text-sm font-semibold text-white">Stats</h3>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{currentAthlete.stats}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={handleSkip}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Skip
            </Button>
            <Button
              onClick={handleSendRequest}
              disabled={isSendingRequest}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSendingRequest ? (
                "Sending..."
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 