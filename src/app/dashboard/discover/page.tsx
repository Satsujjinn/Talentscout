"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import AthleteCard from "./components/AthleteCard";
import SearchAndFilter from "./components/SearchAndFilter";

type AthleteWithUser = {
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
  const [athletes, setAthletes] = useState<AthleteWithUser[]>([]);
  const [filteredAthletes, setFilteredAthletes] = useState<AthleteWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState("");

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
            // User not found in database, redirect to dashboard for role selection
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

        // Fetch athletes
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
        setFilteredAthletes(data);
      } else {
        console.error("Error fetching athletes:", response.status);
        setAthletes([]);
        setFilteredAthletes([]);
      }
    } catch (error) {
      console.error("Error fetching athletes:", error);
      setAthletes([]);
      setFilteredAthletes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterAthletes(query, sportFilter);
  };

  const handleFilter = (sport: string) => {
    setSportFilter(sport);
    filterAthletes(searchQuery, sport);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSportFilter("");
    setFilteredAthletes(athletes);
  };

  const filterAthletes = (query: string, sport: string) => {
    let filtered = athletes;

    // Filter by search query
    if (query) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(athlete => 
        athlete.name.toLowerCase().includes(searchLower) ||
        athlete.sport?.toLowerCase().includes(searchLower) ||
        athlete.achievements?.toLowerCase().includes(searchLower) ||
        athlete.bio?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by sport
    if (sport) {
      filtered = filtered.filter(athlete => 
        athlete.sport?.toLowerCase() === sport.toLowerCase()
      );
    }

    setFilteredAthletes(filtered);
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center py-16">
          <div className="text-warm-brown-500 text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-warm-brown-900 mb-3">
          Discover Athletes
        </h1>
        <p className="text-warm-brown-700 text-lg">
          Browse through talented athletes in the Western Cape and find your next star player
        </p>
        <div className="mt-4 text-sm text-warm-brown-500">
          {filteredAthletes.length} of {athletes.length} athletes available
        </div>
      </div>

      {/* Search and Filter */}
      <SearchAndFilter 
        onSearch={handleSearch}
        onFilter={handleFilter}
        onClear={handleClear}
      />

      {filteredAthletes.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-warm-brown-500 text-xl mb-4">
            {athletes.length === 0 ? "No athletes found yet." : "No athletes match your search."}
          </div>
          <p className="text-warm-brown-400">
            {athletes.length === 0 
              ? "Athletes will appear here once they create their profiles."
              : "Try adjusting your search or filter criteria."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAthletes.map((athlete) => (
            <AthleteCard 
              key={athlete.id} 
              athlete={athlete} 
              currentUserId={user?.id || ""}
            />
          ))}
        </div>
      )}
    </div>
  );
} 