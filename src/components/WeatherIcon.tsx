
import React from "react";
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudFog, 
  CloudSun,
  Moon,
  CloudMoon
} from "lucide-react";
import { WeatherCondition } from "@/types/weather";

interface WeatherIconProps {
  condition: string;
  icon?: string;
  className?: string;
  size?: number;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  condition, 
  icon, 
  className = "", 
  size = 36 
}) => {
  // Map Open-Meteo WMO codes to our conditions
  const getConditionFromIcon = (iconCode: string): WeatherCondition => {
    // Extract the code (remove the day/night suffix)
    const code = parseInt(iconCode?.substring(0, iconCode.length - 1));
    
    if (code === 0) return "clear";
    if (code >= 1 && code <= 3) return "clouds";
    if (code >= 51 && code <= 67 || code >= 80 && code <= 82) return "rain";
    if (code >= 71 && code <= 77 || code === 85 || code === 86) return "snow";
    if (code >= 95 && code <= 99) return "thunderstorm";
    if (code >= 45 && code <= 48) return "mist";
    return "default";
  };
  
  // Check if it's day or night from icon (last character is d or n)
  const isNight = icon?.charAt(icon.length - 1) === 'n';
  
  // Determine the condition either from direct prop or from icon
  const weatherCondition = icon 
    ? getConditionFromIcon(icon) 
    : condition.toLowerCase() as WeatherCondition;
  
  const renderIcon = () => {
    switch (weatherCondition) {
      case "clear":
        return isNight ? <Moon className={`text-yellow-200 ${className}`} size={size} /> : <Sun className={`text-yellow-400 ${className}`} size={size} />;
      case "clouds":
        if (icon && parseInt(icon.substring(0, icon.length - 1)) === 1 || parseInt(icon.substring(0, icon.length - 1)) === 2) {
          return isNight ? <CloudMoon className={`text-gray-500 ${className}`} size={size} /> : <CloudSun className={`text-gray-500 ${className}`} size={size} />;
        } else {
          return <Cloud className={`text-gray-500 ${className}`} size={size} />;
        }
      case "rain":
        return <CloudRain className={`text-blue-500 ${className}`} size={size} />;
      case "snow":
        return <CloudSnow className={`text-blue-200 ${className}`} size={size} />;
      case "thunderstorm":
        return <CloudLightning className={`text-purple-500 ${className}`} size={size} />;
      case "mist":
        return <CloudFog className={`text-gray-400 ${className}`} size={size} />;
      default:
        return <Cloud className={`text-gray-400 ${className}`} size={size} />;
    }
  };
  
  return (
    <div className={`inline-flex items-center justify-center animate-float ${className}`}>
      {renderIcon()}
    </div>
  );
};

export default WeatherIcon;
