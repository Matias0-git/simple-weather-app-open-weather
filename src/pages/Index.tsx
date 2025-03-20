
import React, { useState, useEffect } from "react";
import { useWeather } from "@/hooks/useWeather";
import SearchBar from "@/components/SearchBar";
import WeatherDisplay from "@/components/WeatherDisplay";
import { City } from "@/types/weather";
import { Loader2, Sparkles, Star, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const {
    weather,
    weatherLoading,
    searchResults,
    searchLoading,
    getWeatherByCity,
    searchCities
  } = useWeather();
  
  const [backgroundClass, setBackgroundClass] = useState("bg-gradient-to-br from-blue-400 to-blue-600");
  
  // Update background based on weather condition only when weather changes
  useEffect(() => {
    if (weather) {
      let bgClass = "";
      
      switch (weather.main.toLowerCase()) {
        case "clear":
          bgClass = "bg-weather-clear";
          break;
        case "clouds":
          bgClass = "bg-weather-clouds";
          break;
        case "rain":
          bgClass = "bg-weather-rain";
          break;
        case "snow":
          bgClass = "bg-weather-snow";
          break;
        case "thunderstorm":
          bgClass = "bg-weather-thunderstorm";
          break;
        case "mist":
          bgClass = "bg-weather-mist";
          break;
        default:
          bgClass = "bg-weather-clear";
      }
      
      setBackgroundClass(bgClass);
    }
  }, [weather]);
  
  const handleCitySelect = (city: City) => {
    getWeatherByCity(city.name);
  };
  
  return (
    <div 
      className={cn(
        "min-h-screen transition-all duration-700 w-full",
        backgroundClass
      )}
    >
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl">
        <header className="mb-8 text-center text-white">
          <h1 className="text-4xl font-light mb-4 tracking-tight">
            <span className="font-extralight">Weatherly</span>
          </h1>
          <div className="max-w-md mx-auto">
            <SearchBar 
              onSearch={handleCitySelect}
              onQueryChange={searchCities}
              results={searchResults}
              loading={searchLoading}
            />
          </div>
        </header>
        
        <main className="mx-auto max-w-2xl">
          {weatherLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-white">
              <Loader2 className="h-10 w-10 animate-spin mb-4" />
              <p className="text-lg">Loading weather data...</p>
            </div>
          ) : weather ? (
            <WeatherDisplay data={weather} />
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-white">Failed to load weather data</p>
              <p className="text-white/70 mt-2">
                Try searching for a city above
              </p>
            </div>
          )}
        </main>
        
        <footer className="mt-12 text-center">
          <p className="text-white/70 text-sm mb-3">
            Powered by OpenWeatherMap API
          </p>
          
          {/* Cool signature with animation */}
          <div className="glass-effect py-3 px-6 rounded-full inline-flex items-center justify-center mt-2 group hover:scale-105 transition-all duration-300 shadow-lg">
            <Star className="h-4 w-4 text-yellow-300 mr-2 animate-pulse-slow" />
            <span className="text-gradient font-medium tracking-wider text-md relative">
              Matias Mena Da Dalt
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </span>
            <Award className="h-4 w-4 text-blue-300 ml-2 animate-float" />
            <Sparkles className="h-4 w-4 text-purple-300 ml-1 animate-float" style={{ animationDelay: "0.2s" }} />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
