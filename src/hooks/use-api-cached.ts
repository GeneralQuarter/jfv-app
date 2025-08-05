import { useCallback, useEffect, useState } from 'react';

export default function useApiCached<T>(
  getData: () => Promise<T | undefined>,
  cacheKey: string,
  initialState: T,
): T {
  const [data, setData] = useState<T>(initialState);

  const fetchData = useCallback(
    async (noCache = false) => {
      let data: T | undefined;

      const rawData = localStorage.getItem(cacheKey);

      if (rawData) {
        try {
          data = JSON.parse(rawData) as T;
          setData(data);
        } catch (e) {
          console.error(e);
        }
      }

      if (noCache || !data) {
        data = await getData();

        if (data) {
          localStorage.setItem(cacheKey, JSON.stringify(data));
          setData(data);
        }
      }
    },
    [cacheKey, getData],
  );

  useEffect(() => {
    fetchData(navigator.onLine && import.meta.env.PROD);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  return data;
}
