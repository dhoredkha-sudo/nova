import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

/** স্ক্রিন ফোকাসে এলেই ডাটা রিফ্রেশ হয় */
export function useLoad<T>(fn: () => Promise<T>, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setData(await fn());
    } catch (e) {
      console.warn('load error', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const refresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  return { data, loading, refreshing, refresh, reload: load };
}

export function timeAgo(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min${m > 1 ? 's' : ''} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d > 1 ? 's' : ''} ago`;
}

export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
