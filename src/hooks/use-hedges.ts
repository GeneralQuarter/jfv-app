import type { Hedge } from '../types/hedge';
import useApiCached from './use-api-cached';

function getHedges(): Promise<Hedge[] | undefined> {
  return fetch(`${import.meta.env.VITE_API_BASE_URL ?? ''}/hedges`)
    .then((data) => data.json())
    .then((data) => data.items)
    .catch((e) => {
      console.error(e);
      return;
    });
}

export default function useHedges(): Hedge[] {
  return useApiCached<Hedge[]>(getHedges, 'jfv-hedges-v1', []);
}
