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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold-600 mx-auto mb-4"></div>
          <p className="text-warm-brown-700">Loading athletes...</p>
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

      {athletes.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-cream-200 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-warm-brown-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-warm-brown-900 mb-2">
            No Athletes Available Yet
          </h3>
          <p className="text-warm-brown-600 max-w-md mx-auto">
            Athletes will appear here once they create their profiles and join the platform. 
            The talent pool will grow as more athletes discover Talent Scout ZA.
          </p>
        </div>
      ) : filteredAthletes.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-cream-200 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-warm-brown-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-warm-brown-900 mb-2">
            No Athletes Match Your Search
          </h3>
          <p className="text-warm-brown-600 max-w-md mx-auto">
            Try adjusting your search criteria or filters to find athletes that match your requirements.
          </p>
          <button 
            onClick={handleClear}
            className="mt-4 px-6 py-2 bg-accent-gold-600 text-white rounded-lg hover:bg-accent-gold-700 transition-colors"
          >
            Clear Filters
          </button>
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