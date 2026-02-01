
export type Language = 'en' | 'hi';
export type Theme = 'light' | 'dark';

export interface User {
  email: string;
  name: string;
}

export interface WeatherDay {
  date: string;
  temp: number;
  condition: string;
  precipitation: number;
}

export interface CityData {
  name: string;
  lat: number;
  lng: number;
  floodRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  forecast: WeatherDay[];
  riskSummary: string;
}

export interface Translation {
  login: string;
  signup: string;
  email: string;
  password: string;
  welcome: string;
  dashboard: string;
  searchPlaceholder: string;
  riskLevel: string;
  forecastTitle: string;
  aiAnalysis: string;
  logout: string;
  changeLang: string;
  floodRisk_Low: string;
  floodRisk_Moderate: string;
  floodRisk_High: string;
  floodRisk_Critical: string;
  noData: string;
  condition_Sunny: string;
  condition_PartlyCloudy: string;
  condition_Cloudy: string;
  condition_Rainy: string;
  condition_Stormy: string;
  theme_Light: string;
  theme_Dark: string;
}
