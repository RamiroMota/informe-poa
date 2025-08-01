import { useState, useEffect } from 'react';

const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

export function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    try {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue) {
        const { value, timestamp } = JSON.parse(storedValue);
        if (Date.now() - timestamp < EXPIRATION_TIME) {
          return value;
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      const valueToStore = {
        value: state,
        timestamp: Date.now(),
      };
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, state]);

  return [state, setState];
}