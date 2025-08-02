"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building } from "lucide-react";

interface RoleSelectionProps {
  user: {
    id: string;
    emailAddresses: string[];
  };
}

export default function RoleSelection() {
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
        const errorData = await response.json();
        setMessage(errorData.error || "Error setting role. Please try again.");
      }
    } catch {
      setMessage("Error setting role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Choose Your Role</CardTitle>
          <p className="text-center text-warm-brown-700">
            Please select your role to continue
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => handleRoleSelection("athlete")}
            disabled={isLoading}
            className="w-full h-16 text-lg"
            variant="outline"
          >
            <User className="w-6 h-6 mr-3" />
            I&apos;m an Athlete
          </Button>
          
          <Button
            onClick={() => handleRoleSelection("recruiter")}
            disabled={isLoading}
            className="w-full h-16 text-lg"
            variant="outline"
          >
            <Building className="w-6 h-6 mr-3" />
            I&apos;m a Recruiter
          </Button>
          
          {message && (
            <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 