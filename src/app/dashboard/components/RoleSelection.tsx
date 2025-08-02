"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RoleSelectionProps {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddresses: string[];
  };
}

export default function RoleSelection({ user }: RoleSelectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRoleSelection = async (role: "athlete" | "recruiter") => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        // Reload the page to show the appropriate dashboard
        window.location.reload();
      } else {
        const error = await response.json();
        setMessage(error.error || "Error setting role. Please try again.");
      }
    } catch (error) {
      setMessage("Error setting role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Choose Your Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Please select whether you are an athlete or a recruiter to continue.
          </p>
          
          {message && (
            <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700">
              {message}
            </div>
          )}

          <div className="space-y-4">
            <Button 
              onClick={() => handleRoleSelection("athlete")}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Setting..." : "I'm an Athlete"}
            </Button>
            <Button 
              onClick={() => handleRoleSelection("recruiter")}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isLoading ? "Setting..." : "I'm a Recruiter"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 