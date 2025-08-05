import { useEffect, useState } from 'react';
import { sync } from '../lib/db/db';

export function useSyncDb() {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await sync();
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    })();
  }, []);

  return [loading];
}
