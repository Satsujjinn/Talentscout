"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, X, User } from "lucide-react";
import { useNotifications } from "@/components/NotificationProvider";

interface Profile {
  id: string;
  name: string;
  bio: string | null;
  sport: string | null;
  achievements: string | null;
  stats: string | null;
  imageUrl: string | null;
}

export default function ProfileForm() {
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const { addNotification } = useNotifications();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    sport: "",
    achievements: "",
    stats: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          sport: data.sport || "",
          achievements: data.achievements || "",
          stats: data.stats || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage("Please select a valid image file");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(',')[1]; // Remove data URL prefix

        const response = await fetch("/api/profile/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageData: base64,
            imageType: file.type,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(prev => prev ? { ...prev, imageUrl: data.imageUrl } : null);
          addNotification({
            type: "message",
            title: "Profile Photo Updated",
            message: "Your profile photo has been updated successfully!",
          });
        } else {
          setMessage("Error uploading image. Please try again.");
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setMessage("Error uploading image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setMessage("Profile updated successfully!");
        addNotification({
          type: "message",
          title: "Profile Updated",
          message: "Your profile has been updated successfully!",
        });
      } else {
        const error = await response.json();
        setMessage(error.error || "Error updating profile. Please try again.");
      }
    } catch (error) {
      setMessage("Error updating profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-16">
          <div className="text-gray-500 text-xl">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {profile?.imageUrl ? (
                    <img
                      src={profile.imageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
              {isUploading && (
                <div className="text-sm text-blue-600">Uploading...</div>
              )}
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Sport */}
            <div>
              <Label htmlFor="sport">Sport</Label>
              <Input
                id="sport"
                value={formData.sport}
                onChange={(e) => handleInputChange("sport", e.target.value)}
                placeholder="e.g., Rugby, Cricket, Football"
              />
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself, your experience, and what you're looking for..."
                rows={4}
              />
            </div>

            {/* Achievements */}
            <div>
              <Label htmlFor="achievements">Achievements</Label>
              <Textarea
                id="achievements"
                value={formData.achievements}
                onChange={(e) => handleInputChange("achievements", e.target.value)}
                placeholder="List your achievements, awards, and notable performances..."
                rows={3}
              />
            </div>

            {/* Stats */}
            <div>
              <Label htmlFor="stats">Statistics</Label>
              <Textarea
                id="stats"
                value={formData.stats}
                onChange={(e) => handleInputChange("stats", e.target.value)}
                placeholder="Include relevant statistics, performance metrics, or key numbers..."
                rows={3}
              />
            </div>

            {/* Message */}
            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.includes("successfully") 
                  ? "bg-green-100 text-green-700 border border-green-200" 
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 