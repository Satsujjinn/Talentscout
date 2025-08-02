"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilter: (sport: string) => void;
  onClear: () => void;
}

const sports = [
  "All Sports",
  "Rugby",
  "Cricket", 
  "Soccer",
  "Netball",
  "Athletics",
  "Swimming",
  "Basketball",
  "Tennis",
  "Hockey"
];

export default function SearchAndFilter({ onSearch, onFilter, onClear }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("All Sports");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFilter = (sport: string) => {
    setSelectedSport(sport);
    if (sport === "All Sports") {
      onFilter("");
    } else {
      onFilter(sport);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setSelectedSport("All Sports");
    onClear();
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Search athletes by name, sport, or achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>

          {/* Sport Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Sport:</h3>
            <div className="flex flex-wrap gap-2">
              {sports.map((sport) => (
                <Button
                  key={sport}
                  type="button"
                  variant={selectedSport === sport ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilter(sport)}
                  className={selectedSport === sport ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {sport}
                </Button>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 