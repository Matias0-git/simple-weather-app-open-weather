
import { geocodingService } from "./geocodingService";
import { transformationService } from "./transformationService";
import { cacheService } from "./cache";
import { City, WeatherData } from "@/types/weather";

// Constants
const BASE_URL = "https://api.open-meteo.com/v1";

/**
 * Service for fetching weather data from API
 */
export const weatherApiService = {
  /**
   * Get weather data by coordinates
   */
  async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    // Create a cache key
    const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
    
    // Check cache first
    const cachedData = cacheService.getCachedWeather(cacheKey);
    if (cachedData) {
      console.log("Using cached coordinate weather data");
      return cachedData;
    }
    
    try {
      // Get location name from reverse geocoding
      const { cityName, country } = await geocodingService.getReverseGeoLocation(lat, lon);
      
      // Get weather data
      const response = await fetch(
        `${BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=sunrise,sunset&timezone=auto`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      
      const data = await response.json();
      const transformedData = transformationService.transformWeatherData(data, cityName, country);
      
      // Save to cache
      cacheService.saveToCache(cacheKey, transformedData);
      
      return transformedData;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  },
  
  /**
   * Get weather data by city name
   */
  async getWeatherByCity(cityName: string): Promise<WeatherData> {
    try {
      // Check cache first with city name as key
      const normalizedCityName = cityName.toLowerCase().trim();
      const cachedData = cacheService.getCachedWeather(normalizedCityName);
      if (cachedData) {
        console.log(`Using cached city weather data for ${cityName}`);
        return cachedData;
      }
      
      // First get coordinates from geocoding API
      const geoData = await geocodingService.getGeoLocation(cityName);
      
      // Then get weather data with coordinates
      const response = await fetch(
        `${BASE_URL}/forecast?latitude=${geoData.lat}&longitude=${geoData.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=sunrise,sunset&timezone=auto`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      
      const data = await response.json();
      const transformedData = transformationService.transformWeatherData(data, cityName, geoData.country);
      
      // Save to cache with normalized city name as key
      cacheService.saveToCache(normalizedCityName, transformedData);
      
      return transformedData;
    } catch (error) {
      console.error("Error fetching weather data by city:", error);
      throw error;
    }
  },
  
  /**
   * Search for cities by query
   */
  async searchCities(query: string): Promise<City[]> {
    if (!query || query.length < 2) return [];
    
    try {
      // Use cache for search results too
      const cacheKey = `search:${query.toLowerCase().trim()}`;
      const cachedResults = cacheService.getCachedSearch(cacheKey);
      if (cachedResults) {
        console.log(`Using cached search results for "${query}"`);
        return cachedResults;
      }
      
      const results = await geocodingService.searchCities(query);
      
      const cityResults = results.map((item: any) => ({
        name: item.name,
        country: item.country,
        state: item.admin1 || ""
      }));
      
      // Cache search results
      cacheService.saveSearchToCache(cacheKey, cityResults);
      
      return cityResults;
    } catch (error) {
      console.error("Error searching cities:", error);
      throw error;
    }
  }
};
