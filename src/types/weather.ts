
export interface WeatherData {
  cityName: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  main: string;
  dt: number;
  timezone: number;
  sunrise: number;
  sunset: number;
  lat: number;
  lon: number;
}

export interface WeatherError {
  message: string;
  code?: string;
}

export type WeatherCondition = 
  | 'clear' 
  | 'clouds' 
  | 'rain' 
  | 'snow' 
  | 'thunderstorm' 
  | 'mist' 
  | 'default';

export interface City {
  name: string;
  country: string;
  state?: string;
}

export interface SearchResult {
  data: City[];
  loading: boolean;
  error: string | null;
}

export interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}
