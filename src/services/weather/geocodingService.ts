
/**
 * Service for handling geocoding operations
 */
export const geocodingService = {
  /**
   * Get location coordinates from city name
   */
  async getGeoLocation(cityName: string): Promise<{lat: number; lon: number; country: string}> {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
      );
      
      if (!response.ok) {
        throw new Error("Failed to geocode city");
      }
      
      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        throw new Error(`City "${cityName}" not found`);
      }
      
      const result = data.results[0];
      return {
        lat: result.latitude,
        lon: result.longitude,
        country: result.country
      };
    } catch (error) {
      console.error("Error geocoding city:", error);
      throw error;
    }
  },

  /**
   * Get location name from coordinates
   */
  async getReverseGeoLocation(lat: number, lon: number): Promise<{cityName: string; country: string}> {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`
      );
      
      let cityName = "Unknown Location";
      let country = "";
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          cityName = data.results[0].name;
          country = data.results[0].country;
        }
      }
      
      return { cityName, country };
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      return { cityName: "Unknown Location", country: "" };
    }
  },

  /**
   * Search for cities by name
   */
  async searchCities(query: string): Promise<any[]> {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }
      
      const data = await response.json();
      
      if (!data.results) return [];
      
      return data.results;
    } catch (error) {
      console.error("Error searching cities:", error);
      throw error;
    }
  }
};
