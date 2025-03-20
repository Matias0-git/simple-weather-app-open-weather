
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, X, Loader2 } from "lucide-react";
import { City } from "@/types/weather";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (city: City) => void;
  onQueryChange: (query: string) => void;
  results: City[];
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onQueryChange, 
  results, 
  loading 
}) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Handle outside click to close results dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Use debounce with useCallback to prevent excessive API calls
  const debouncedSearch = useCallback(() => {
    if (query) {
      onQueryChange(query);
    }
  }, [query, onQueryChange]);
  
  // Handle query change with improved debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      debouncedSearch();
    }, 500); // Increased debounce time to 500ms to reduce API calls
    
    return () => clearTimeout(delayDebounceFn);
  }, [debouncedSearch]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };
  
  const handleSelectCity = (city: City) => {
    onSearch(city);
    setQuery(`${city.name}, ${city.country}`);
    setIsFocused(false);
  };
  
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-weather-gray" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          className={cn(
            "search-input pl-10 pr-10 py-3.5 transition-all duration-300",
            isFocused ? "ring-2 ring-weather-blue/30" : "ring-0"
          )}
          placeholder="Search for a city..."
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
        />
        
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-3 flex items-center"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 text-weather-gray animate-spin" />
            ) : (
              <X className="h-5 w-5 text-weather-gray hover:text-weather-gray-dark transition-colors" />
            )}
          </button>
        )}
      </div>
      
      {isFocused && query.length > 1 && (
        <div 
          ref={resultsRef}
          className={cn(
            "absolute z-10 mt-1 w-full glass-effect rounded-lg overflow-hidden shadow-lg",
            "animate-slide-down origin-top transition-all duration-200"
          )}
        >
          {loading ? (
            <div className="py-4 text-center text-weather-gray-dark">
              <Loader2 className="h-5 w-5 mx-auto animate-spin" />
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-4 text-center text-weather-gray-dark">
              <p>No results found</p>
            </div>
          ) : (
            <ul>
              {results.map((city, index) => (
                <li 
                  key={`${city.name}-${city.country}-${index}`}
                  className="border-b border-gray-100 last:border-0"
                >
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-white/40 transition-colors flex items-center"
                    onClick={() => handleSelectCity(city)}
                  >
                    <MapPin className="h-4 w-4 mr-2 text-weather-blue" />
                    <span className="font-medium">{city.name}</span>
                    <span className="ml-1 text-sm text-gray-500">
                      {city.state ? `${city.state}, ` : ""}
                      {city.country}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
