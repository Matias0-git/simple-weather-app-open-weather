
import { weatherApiService } from "./apiService";

// Export the weather service with the same interface as before
export const weatherService = {
  getWeatherByCoordinates: weatherApiService.getWeatherByCoordinates,
  getWeatherByCity: weatherApiService.getWeatherByCity,
  searchCities: weatherApiService.searchCities
};
