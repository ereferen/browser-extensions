export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
  color?: string;
}

const STORAGE_KEYS = {
  BOOKMARKS: 'octopath_bookmarks',
  SETTINGS: 'octopath_settings',
  WEATHER_CACHE: 'octopath_weather_cache',
  NEWS_CACHE: 'octopath_news_cache',
} as const;

const DEFAULT_BOOKMARKS: Bookmark[] = [
  { id: '1', title: 'Google', url: 'https://google.com', color: '#4285F4' },
  { id: '2', title: 'YouTube', url: 'https://youtube.com', color: '#FF0000' },
  { id: '3', title: 'GitHub', url: 'https://github.com', color: '#333333' },
  { id: '4', title: 'Twitter', url: 'https://twitter.com', color: '#1DA1F2' },
  { id: '5', title: 'Zenn', url: 'https://zenn.dev', color: '#3EA8FF' },
  { id: '6', title: 'Qiita', url: 'https://qiita.com', color: '#55C500' },
  { id: '7', title: 'Stack Overflow', url: 'https://stackoverflow.com', color: '#F48024' },
  { id: '8', title: 'Reddit', url: 'https://reddit.com', color: '#FF4500' },
];

// Check if Chrome storage API is available
const isChromeStorageAvailable = (): boolean => {
  return typeof chrome !== 'undefined' && chrome.storage?.sync !== undefined;
};

// Get bookmarks from storage
export async function getBookmarks(): Promise<Bookmark[]> {
  try {
    if (isChromeStorageAvailable()) {
      const result = await chrome.storage.sync.get(STORAGE_KEYS.BOOKMARKS);
      return (result[STORAGE_KEYS.BOOKMARKS] as Bookmark[] | undefined) || DEFAULT_BOOKMARKS;
    } else {
      const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return stored ? JSON.parse(stored) : DEFAULT_BOOKMARKS;
    }
  } catch (error) {
    console.error('Failed to get bookmarks:', error);
    return DEFAULT_BOOKMARKS;
  }
}

// Save bookmarks to storage
export async function saveBookmarks(bookmarks: Bookmark[]): Promise<void> {
  try {
    if (isChromeStorageAvailable()) {
      await chrome.storage.sync.set({ [STORAGE_KEYS.BOOKMARKS]: bookmarks });
    } else {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    }
  } catch (error) {
    console.error('Failed to save bookmarks:', error);
  }
}

// Generate a unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

// Cache utilities for weather/news
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    if (isChromeStorageAvailable()) {
      const result = await chrome.storage.local.get(key);
      const cached = result[key] as CacheEntry<T> | undefined;
      if (cached && cached.expiry > Date.now()) {
        return cached.data;
      }
    } else {
      const stored = localStorage.getItem(key);
      if (stored) {
        const cached = JSON.parse(stored);
        if (cached.expiry > Date.now()) {
          return cached.data as T;
        }
      }
    }
  } catch (error) {
    console.error('Failed to get cache:', error);
  }
  return null;
}

export async function setCache<T>(key: string, data: T, ttlMs: number): Promise<void> {
  try {
    const cached = { data, expiry: Date.now() + ttlMs };
    if (isChromeStorageAvailable()) {
      await chrome.storage.local.set({ [key]: cached });
    } else {
      localStorage.setItem(key, JSON.stringify(cached));
    }
  } catch (error) {
    console.error('Failed to set cache:', error);
  }
}
