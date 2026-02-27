import { storage } from '@ruck/sdk';

/**
 * 统一的存储工具钩子，优先使用 Ruck SDK storage，降级到 localStorage
 */
export function useStorage() {
  const getItem = async (key, defaultValue) => {
    try {
      const value = await storage.get(key);
      return value !== undefined && value !== null ? value : defaultValue;
    } catch (e) {
      console.warn('Failed to get item from SDK storage, falling back to localStorage', e);
      const localValue = localStorage.getItem(key);
      return localValue !== null ? localValue : defaultValue;
    }
  };

  const setItem = async (key, value) => {
    try {
      await storage.set(key, value);
    } catch (e) {
      console.warn('Failed to set item in SDK storage, falling back to localStorage', e);
    }
    localStorage.setItem(key, value);
  };

  return {
    getItem,
    setItem
  };
}
