
import { WeatherData, City } from "@/types/weather";
import { CacheItem, CACHE_TIME } from "./types";

// Cache for weather data
const weatherCache = new Map<string, CacheItem>();

// Cache for search results
interface SearchCacheItem {
  data: City[];
  timestamp: number;
}
const searchCache = new Map<string, SearchCacheItem>();

export const cacheService = {
  /**
   * Get data from cache if it exists and is not expired
   */
  getCachedWeather(key: string): WeatherData | null {
    const cachedData = weatherCache.get(key);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TIME) {
      console.log("Using cached weather data");
      return cachedData.data;
    }
    return null;
  },

  /**
   * Save weather data to cache
   */
  saveToCache(key: string, data: WeatherData): void {
    weatherCache.set(key, {
      data,
      timestamp: Date.now()
    });
  },
  
  /**
   * Get search results from cache
   */
  getCachedSearch(key: string): City[] | null {
    const cachedData = searchCache.get(key);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TIME) {
      return cachedData.data;
    }
    return null;
  },
  
  /**
   * Save search results to cache
   */
  saveSearchToCache(key: string, data: City[]): void {
    searchCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
};
