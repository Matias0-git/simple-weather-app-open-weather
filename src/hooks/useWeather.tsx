
import { useState, useEffect, useCallback } from "react";
import { weatherService } from "@/services/weather"; // Updated import path
import { WeatherData, WeatherError, WeatherState, City, SearchResult } from "@/types/weather";
import { useToast } from "@/components/ui/use-toast";

export function useWeather() {
  const [weatherState, setWeatherState] = useState<WeatherState>({
    data: null,
    loading: false,
    error: null,
  });
  
  const [searchState, setSearchState] = useState<SearchResult>({
    data: [],
    loading: false,
    error: null,
  });
  
  const { toast } = useToast();
  
  // Prevent getWeatherByCoordinates from being recreated on each render
  const getWeatherByCoordinates = useCallback(async (lat: number, lon: number) => {
    // Don't fetch if already loading to prevent multiple requests
    if (weatherState.loading) return;
    
    setWeatherState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await weatherService.getWeatherByCoordinates(lat, lon);
      setWeatherState({ data, loading: false, error: null });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to fetch weather data";
      setWeatherState({ data: null, loading: false, error: errorMsg });
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  }, [toast, weatherState.loading]);
  
  // Prevent getWeatherByCity from being recreated on each render
  const getWeatherByCity = useCallback(async (cityName: string) => {
    // Don't fetch if already loading to prevent multiple requests
    if (weatherState.loading) return;
    
    setWeatherState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await weatherService.getWeatherByCity(cityName);
      setWeatherState({ data, loading: false, error: null });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to fetch weather data";
      setWeatherState({ data: null, loading: false, error: errorMsg });
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  }, [toast, weatherState.loading]);
  
  // Prevent searchCities from being recreated on each render
  const searchCities = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchState(prev => ({ ...prev, data: [], loading: false }));
      return;
    }
    
    // Prevent rapid re-searches while still loading
    if (searchState.loading) return;
    
    setSearchState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await weatherService.searchCities(query);
      setSearchState({ data, loading: false, error: null });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Failed to search cities";
      setSearchState({ data: [], loading: false, error: errorMsg });
    }
  }, [searchState.loading]);
  
  // Get current location weather on initial load
  useEffect(() => {
    const getLocationWeather = () => {
      if (navigator.geolocation) {
        setWeatherState(prev => ({ ...prev, loading: true }));
        
        navigator.geolocation.getCurrentPosition(
          position => {
            getWeatherByCoordinates(
              position.coords.latitude, 
              position.coords.longitude
            );
          },
          error => {
            console.error("Geolocation error:", error);
            // Default to a major city if geolocation fails
            getWeatherByCity("London");
          }
        );
      } else {
        // Default to a major city if geolocation not supported
        getWeatherByCity("London");
      }
    };
    
    // Only run on initial mount
    getLocationWeather();
    // Using empty dependency array to run only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return {
    weather: weatherState.data,
    weatherLoading: weatherState.loading,
    weatherError: weatherState.error,
    searchResults: searchState.data,
    searchLoading: searchState.loading,
    searchError: searchState.error,
    getWeatherByCity,
    getWeatherByCoordinates,
    searchCities,
  };
}
