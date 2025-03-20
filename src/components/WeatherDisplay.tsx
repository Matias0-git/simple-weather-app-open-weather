
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { WeatherData } from "@/types/weather";
import WeatherIcon from "./WeatherIcon";
import { Droplets, Wind, Sunrise, Sunset } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherDisplayProps {
  data: WeatherData;
  className?: string;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ data, className }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  const getWeatherBackground = (condition: string): string => {
    switch (condition.toLowerCase()) {
      case "clear": return "bg-weather-clear";
      case "clouds": return "bg-weather-clouds";
      case "rain": return "bg-weather-rain";
      case "snow": return "bg-weather-snow";
      case "thunderstorm": return "bg-weather-thunderstorm";
      case "mist": return "bg-weather-mist";
      default: return "bg-weather-clear";
    }
  };
  
  const lastUpdated = formatDistanceToNow(new Date(data.dt), { addSuffix: true });
  
  return (
    <div className={cn("animate-fade-in", className)}>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <WeatherIcon 
            condition={data.main} 
            icon={data.icon} 
            size={48} 
            className="mr-2" 
          />
          <h1 className="text-4xl font-light">
            {data.cityName}
            <span className="text-sm ml-2 text-gray-500 font-normal">
              {data.country}
            </span>
          </h1>
        </div>
        <p className="text-lg text-gray-600 capitalize">{data.description}</p>
        <p className="text-xs text-gray-500 mt-1">Updated {lastUpdated}</p>
      </div>
      
      <div className="weather-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-8xl font-extralight text-weather-blue-dark">
                {data.temperature}°C
              </h2>
              <p className="text-gray-500 mt-1">
                Feels like {data.feelsLike}°C
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-2 glass-effect rounded-xl">
              <Droplets className="h-6 w-6 mb-2 text-blue-500" />
              <span className="text-xl font-medium">{data.humidity}%</span>
              <span className="text-xs text-gray-500">Humidity</span>
            </div>
            
            <div className="flex flex-col items-center p-2 glass-effect rounded-xl">
              <Wind className="h-6 w-6 mb-2 text-blue-400" />
              <span className="text-xl font-medium">{data.windSpeed} m/s</span>
              <span className="text-xs text-gray-500">Wind</span>
            </div>
            
            <div className="flex flex-col items-center p-2 glass-effect rounded-xl">
              <Sunrise className="h-6 w-6 mb-2 text-yellow-500" />
              <span className="text-xl font-medium">{formatTime(data.sunrise)}</span>
              <span className="text-xs text-gray-500">Sunrise</span>
            </div>
            
            <div className="flex flex-col items-center p-2 glass-effect rounded-xl">
              <Sunset className="h-6 w-6 mb-2 text-orange-500" />
              <span className="text-xl font-medium">{formatTime(data.sunset)}</span>
              <span className="text-xs text-gray-500">Sunset</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
