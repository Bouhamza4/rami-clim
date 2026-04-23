import { useEffect, useState } from "react";

export type Weather = {
  temp: number;
  code: number;
  isDay: boolean;
};

// Open-Meteo: free, no API key. Tanger coords: 35.7595° N, 5.8340° W
const URL =
  "https://api.open-meteo.com/v1/forecast?latitude=35.7595&longitude=-5.8340&current=temperature_2m,weather_code,is_day&timezone=auto";

const CACHE_KEY = "rc-weather-tanger";
const CACHE_MS = 15 * 60 * 1000; // 15 min

export const useWeather = () => {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_MS) {
          setWeather(data);
          setLoading(false);
          return;
        }
      } catch {}
    }
    fetch(URL)
      .then((r) => r.json())
      .then((j) => {
        const data: Weather = {
          temp: Math.round(j.current?.temperature_2m ?? 20),
          code: j.current?.weather_code ?? 0,
          isDay: (j.current?.is_day ?? 1) === 1,
        };
        setWeather(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
      })
      .catch(() => setWeather({ temp: 20, code: 0, isDay: true }))
      .finally(() => setLoading(false));
  }, []);

  return { weather, loading };
};

// WMO codes → category
export const weatherCategory = (code: number): "sun" | "cloud" | "rain" | "snow" | "storm" | "fog" => {
  if (code === 0) return "sun";
  if ([1, 2, 3].includes(code)) return "cloud";
  if ([45, 48].includes(code)) return "fog";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([95, 96, 99].includes(code)) return "storm";
  return "cloud";
};
