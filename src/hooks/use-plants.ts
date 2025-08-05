import type { Plant } from '../types/plant';
import useApiCached from './use-api-cached';

function getPlants(): Promise<Plant[] | undefined> {
  return fetch(
    `${import.meta.env.VITE_API_BASE_URL ?? ''}/plants-with-position`,
  )
    .then((res) => res.json())
    .then((data) => data.items)
    .catch((e) => {
      console.error(e);
      return;
    });
}

export default function usePlants(): Plant[] {
  return useApiCached<Plant[]>(getPlants, 'jfv-plants-v1', []);
}
