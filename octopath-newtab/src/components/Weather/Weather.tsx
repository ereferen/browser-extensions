import { useState, useEffect } from 'react';
import type { WeatherData } from '../../utils/api';
import { fetchWeather, getWeatherEmoji } from '../../utils/api';
import styles from './Weather.module.css';

// For demo/development, we'll show a placeholder when no API key is set
const DEMO_WEATHER: WeatherData = {
  temp: 18,
  description: '晴れ',
  icon: '01d',
  city: 'Tokyo',
  humidity: 65,
  windSpeed: 3.5,
};

export function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        // Try to get API key from storage
        const apiKey = localStorage.getItem('openweather_api_key');

        if (!apiKey) {
          // Show demo data if no API key
          setWeather(DEMO_WEATHER);
          setLoading(false);
          return;
        }

        const data = await fetchWeather(apiKey);
        if (data) {
          setWeather(data);
        } else {
          setWeather(DEMO_WEATHER);
        }
      } catch {
        setError('天気情報を取得できません');
        setWeather(DEMO_WEATHER);
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <span className={styles.loadingDot}>.</span>
          <span className={styles.loadingDot}>.</span>
          <span className={styles.loadingDot}>.</span>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.weatherIcon}>
        <span className={styles.emoji}>{getWeatherEmoji(weather.icon)}</span>
      </div>

      <div className={styles.info}>
        <div className={styles.temp}>{weather.temp}°C</div>
        <div className={styles.description}>{weather.description}</div>
        <div className={styles.city}>{weather.city}</div>
      </div>

      <div className={styles.details}>
        <div className={styles.detail}>
          <span className={styles.detailIcon}>💧</span>
          <span className={styles.detailValue}>{weather.humidity}%</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.detailIcon}>🌬️</span>
          <span className={styles.detailValue}>{weather.windSpeed}m/s</span>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
