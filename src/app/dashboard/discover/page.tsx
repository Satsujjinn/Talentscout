"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserCard from "./components/AthleteCard";
import SearchAndFilter from "./components/SearchAndFilter";

type UserWithProfile = {
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
};

export default function DiscoverPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      router.push("/sign-in");
      return;
    }

    // Check user role and fetch appropriate data
    const checkUserRole = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) {
          if (response.status === 404) {
            // User not found in database, redirect to dashboard for role selection
            router.push("/dashboard");
            return;
          }
          throw new Error(`HTTP ${response.status}`);
        }
        
        const userData = await response.json();
        setUserRole(userData.role);
        
        if (!userData || !["athlete", "recruiter"].includes(userData.role)) {
          router.push("/dashboard");
          return;
        }

        // Fetch appropriate data based on user role
        if (userData.role === "recruiter") {
          await fetchAthletes();
        } else {
          await fetchRecruiters();
        }
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
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error("Error fetching athletes:", response.status);
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error("Error fetching athletes:", error);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecruiters = async () => {
    try {
      const response = await fetch("/api/recruiters");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error("Error fetching recruiters:", response.status);
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error("Error fetching recruiters:", error);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterUsers(query, sportFilter);
  };

  const handleFilter = (sport: string) => {
    setSportFilter(sport);
    filterUsers(searchQuery, sport);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSportFilter("");
    setFilteredUsers(users);
  };

  const filterUsers = (query: string, sport: string) => {
    let filtered = users;

    // Filter by search query
    if (query) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.sport?.toLowerCase().includes(searchLower) ||
        user.achievements?.toLowerCase().includes(searchLower) ||
        user.bio?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by sport
    if (sport) {
      filtered = filtered.filter(user => 
        user.sport?.toLowerCase() === sport.toLowerCase()
      );
    }

    setFilteredUsers(filtered);
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center py-16">
          <div className="text-gray-300 text-xl">
            Loading {userRole === "recruiter" ? "athletes" : "recruiters"}...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-3">
          Discover {userRole === "recruiter" ? "Athletes" : "Recruiters"} 🔍
        </h1>
        <p className="text-gray-300 text-lg">
          {userRole === "recruiter" 
            ? "Browse through talented athletes in the Western Cape and find your next star player"
            : "Connect with recruiters and explore opportunities in the Western Cape"
          }
        </p>
        <div className="mt-4 text-sm text-gray-400">
          {filteredUsers.length} of {users.length} {userRole === "recruiter" ? "athletes" : "recruiters"} available
        </div>
      </div>

      {/* Search and Filter */}
      <SearchAndFilter 
        onSearch={handleSearch}
        onFilter={handleFilter}
        onClear={handleClear}
      />

      {filteredUsers.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-300 text-xl mb-4">
            {users.length === 0 
              ? `No ${userRole === "recruiter" ? "athletes" : "recruiters"} found yet.` 
              : `No ${userRole === "recruiter" ? "athletes" : "recruiters"} match your search.`
            }
          </div>
          <p className="text-gray-400 mb-6">
            {users.length === 0 
              ? `${userRole === "recruiter" ? "Athletes" : "Recruiters"} will appear here once they create their profiles.`
              : "Try adjusting your search or filter criteria."
            }
          </p>
          {users.length === 0 && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-white mb-3">How to get started:</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">1</div>
                  <p>Create your profile with your name, sport, and achievements</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">2</div>
                  <p>Add a bio and stats to make your profile stand out</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">3</div>
                  <p>Other users will then be able to discover and connect with you</p>
                </div>
              </div>
              <Link href="/dashboard/profile">
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                  Create Your Profile
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <UserCard 
              key={user.id} 
              user={user}
              userRole={userRole || undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
} 