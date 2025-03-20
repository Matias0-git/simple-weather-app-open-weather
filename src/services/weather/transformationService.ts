
import { WeatherData } from "@/types/weather";

/**
 * Service for transforming weather API data to our app format
 */
export const transformationService = {
  /**
   * Transform API data to our WeatherData format
   */
  transformWeatherData(data: any, cityName: string, country: string = ""): WeatherData {
    const current = data.current;
    
    const main = this.getMainCondition(current.weather_code);
    const isDay = current.is_day === 1;
    
    // Generate an icon code
    const iconCode = `${current.weather_code}${isDay ? 'd' : 'n'}`;
    
    // Extract sunrise and sunset times
    const sunriseDate = new Date(data.daily.sunrise[0]);
    const sunsetDate = new Date(data.daily.sunset[0]);
    
    return {
      cityName: cityName,
      country: country,
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      description: this.getWeatherDescription(current.weather_code, isDay),
      icon: iconCode,
      main: main,
      dt: new Date().getTime(),
      timezone: data.timezone_abbreviation,
      sunrise: sunriseDate.getTime(),
      sunset: sunsetDate.getTime(),
      lat: data.latitude,
      lon: data.longitude
    };
  },

  /**
   * Map WMO codes to our weather conditions
   */
  getMainCondition(code: number): string {
    // WMO Weather interpretation codes (WW)
    // https://open-meteo.com/en/docs
    if (code === 0) return "clear";
    if (code === 1 || code === 2 || code === 3) return "clouds";
    if (code >= 51 && code <= 67) return "rain";
    if (code >= 71 && code <= 77) return "snow";
    if (code >= 95 && code <= 99) return "thunderstorm";
    if (code >= 45 && code <= 48) return "mist";
    return "default";
  },

  /**
   * Get weather description from WMO code
   */
  getWeatherDescription(code: number, isDay: boolean): string {
    // WMO Weather interpretation codes (WW)
    switch (code) {
      case 0: return isDay ? "Clear sky" : "Clear night";
      case 1: return "Mainly clear";
      case 2: return "Partly cloudy";
      case 3: return "Overcast";
      case 45: return "Fog";
      case 48: return "Depositing rime fog";
      case 51: return "Light drizzle";
      case 53: return "Moderate drizzle";
      case 55: return "Dense drizzle";
      case 56: return "Light freezing drizzle";
      case 57: return "Dense freezing drizzle";
      case 61: return "Slight rain";
      case 63: return "Moderate rain";
      case 65: return "Heavy rain";
      case 66: return "Light freezing rain";
      case 67: return "Heavy freezing rain";
      case 71: return "Slight snow fall";
      case 73: return "Moderate snow fall";
      case 75: return "Heavy snow fall";
      case 77: return "Snow grains";
      case 80: return "Slight rain showers";
      case 81: return "Moderate rain showers";
      case 82: return "Violent rain showers";
      case 85: return "Slight snow showers";
      case 86: return "Heavy snow showers";
      case 95: return "Thunderstorm";
      case 96: return "Thunderstorm with slight hail";
      case 99: return "Thunderstorm with heavy hail";
      default: return "Unknown";
    }
  }
};
