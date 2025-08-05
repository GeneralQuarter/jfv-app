import { useEffect, useRef, useState } from 'react';
import searchWorkerUrl from '../searchWorker?worker&url';
import type { Plant } from '../types/plant';
import type { SearchEntryGroup } from '../types/search-entry';
import type {
  LoadDataSearchWorkerMessage,
  SearchForSearchWorkerMessage,
} from '../types/search-worker-message';
import type { Tags } from '../types/tags';

export default function useSearchWorker(
  plants: Plant[],
  tags: Tags,
  searchTerm: string,
) {
  const [results, setResults] = useState<SearchEntryGroup[]>([]);
  const workerRef = useRef<Worker>(null);

  useEffect(() => {
    if (
      workerRef.current === null ||
      plants.length === 0 ||
      Object.keys(tags).length === 0
    ) {
      return;
    }

    const message: LoadDataSearchWorkerMessage = {
      type: 'data',
      data: {
        plants,
        tags,
      },
    };

    workerRef.current.postMessage(message);
  }, [plants, tags]);

  useEffect(() => {
    // @ts-expect-error setting the worker
    workerRef.current = new Worker(searchWorkerUrl, { type: 'module' });

    workerRef.current.addEventListener(
      'message',
      (e: MessageEvent<SearchEntryGroup[]>) => {
        setResults(e.data);
      },
    );

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (workerRef.current === null) {
      return;
    }

    const message: SearchForSearchWorkerMessage = {
      type: 'search',
      data: searchTerm,
    };

    workerRef.current.postMessage(message);
  }, [searchTerm]);

  return [results];
}
