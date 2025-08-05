import type { Rectangle } from '../types/rectangle';
import useApiCached from './use-api-cached';

function getRectangles(): Promise<Rectangle[] | undefined> {
  return fetch(
    `${import.meta.env.VITE_API_BASE_URL ?? ''}/rectangles-with-coords`,
  )
    .then((data) => data.json())
    .then((data) => data.items)
    .catch((e) => {
      console.error(e);
      return;
    });
}

export default function useRectangles(): Rectangle[] {
  return useApiCached<Rectangle[]>(getRectangles, 'jfv-rectangles-v1', []);
}
