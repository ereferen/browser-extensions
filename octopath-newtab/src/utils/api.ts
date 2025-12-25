import { getCache, setCache } from './storage';

// Weather types
export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  city: string;
  humidity: number;
  windSpeed: number;
}

// News types
export interface NewsItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
}

const WEATHER_CACHE_KEY = 'octopath_weather';
const NEWS_CACHE_KEY = 'octopath_news';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Get user's position
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    });
  });
}

// Fetch weather data from OpenWeatherMap
// Note: User needs to provide their own API key
export async function fetchWeather(apiKey: string): Promise<WeatherData | null> {
  // Check cache first
  const cached = await getCache<WeatherData>(WEATHER_CACHE_KEY);
  if (cached) return cached;

  try {
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=ja`
    );

    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();
    const weather: WeatherData = {
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      city: data.name,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 10) / 10,
    };

    // Cache the result
    await setCache(WEATHER_CACHE_KEY, weather, CACHE_TTL);
    return weather;
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    return null;
  }
}

// Map OpenWeatherMap icon codes to game-style weather names
export function getWeatherEmoji(iconCode: string): string {
  const iconMap: Record<string, string> = {
    '01d': '☀️', // Clear sky day
    '01n': '🌙', // Clear sky night
    '02d': '⛅', // Few clouds day
    '02n': '☁️', // Few clouds night
    '03d': '☁️', // Scattered clouds
    '03n': '☁️',
    '04d': '☁️', // Broken clouds
    '04n': '☁️',
    '09d': '🌧️', // Shower rain
    '09n': '🌧️',
    '10d': '🌦️', // Rain day
    '10n': '🌧️', // Rain night
    '11d': '⛈️', // Thunderstorm
    '11n': '⛈️',
    '13d': '🌨️', // Snow
    '13n': '🌨️',
    '50d': '🌫️', // Mist
    '50n': '🌫️',
  };
  return iconMap[iconCode] || '☁️';
}

// Fetch tech news from Hacker News
export async function fetchNews(): Promise<NewsItem[]> {
  // Check cache first
  const cached = await getCache<NewsItem[]>(NEWS_CACHE_KEY);
  if (cached) return cached;

  try {
    // Fetch top stories from Hacker News API
    const topStoriesRes = await fetch(
      'https://hacker-news.firebaseio.com/v0/topstories.json'
    );
    const storyIds = await topStoriesRes.json();

    // Get first 15 stories
    const stories = await Promise.all(
      storyIds.slice(0, 15).map(async (id: number) => {
        const res = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        return res.json();
      })
    );

    const news: NewsItem[] = stories.map((story) => ({
      title: story.title,
      link: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      source: 'Hacker News',
      pubDate: new Date(story.time * 1000).toLocaleDateString('ja-JP'),
    }));

    // Cache the result
    await setCache(NEWS_CACHE_KEY, news, CACHE_TTL);
    return news;
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
}
