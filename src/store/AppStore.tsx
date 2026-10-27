import React, {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Progress } from '../types';
import { initialProgress } from '../utils/progress';
const key = '@deep-blue/progress/v1';
type Store = {
  state: Progress;
  ready: boolean;
  error: string | null;
  update: (fn: (s: Progress) => Progress) => Promise<void>;
};
const Context = createContext<Store | null>(null);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialProgress);
  const ref = useRef(state);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    AsyncStorage.getItem(key)
      .then(raw => {
        if (raw) {
          const parsed = JSON.parse(raw);
          if (
            !parsed ||
            !Array.isArray(parsed.bookings) ||
            !Array.isArray(parsed.visited)
          )
            throw Error('Invalid saved data');
          ref.current = { ...initialProgress, ...parsed };
          setState(ref.current);
        }
      })
      .catch(() =>
        setError(
          'Your saved data could not be loaded. Restart the app to try again.',
        ),
      )
      .finally(() => setReady(true));
  }, []);
  const update = useCallback((fn: (s: Progress) => Progress) => {
    const task = queue.current.then(async () => {
      const next = fn(ref.current);
      await AsyncStorage.setItem(key, JSON.stringify(next));
      ref.current = next;
      setState(next);
    });
    queue.current = task.catch(() => {
      setError(
        'Changes could not be saved. Please free device storage and try again.',
      );
    });
    return task;
  }, []);
  return (
    <Context.Provider value={{ state, ready, error, update }}>
      {children}
    </Context.Provider>
  );
}
export function useApp() {
  const value = useContext(Context);
  if (!value) throw Error('Missing AppProvider');
  return value;
}
