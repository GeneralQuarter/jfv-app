import type { Tags } from '../types/tags';
import useApiCached from './use-api-cached';

function getTags(): Promise<Tags | undefined> {
  return fetch(`${import.meta.env.VITE_API_BASE_URL ?? ''}/tags`)
    .then((res) => res.json())
    .catch((e) => {
      console.error(e);
      return;
    });
}

export default function useTags(): Tags {
  return useApiCached<Tags>(getTags, 'jfv-tags-v1', {});
}
