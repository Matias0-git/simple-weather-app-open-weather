
import { City, WeatherData } from "@/types/weather";

// Cache mechanism
export interface CacheItem {
  data: WeatherData;
  timestamp: number;
}

export const CACHE_TIME = 30 * 1000; // 30 seconds in milliseconds
