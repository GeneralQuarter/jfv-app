import type { Plant } from './plant';
import type { Tags } from './tags';

type GenericSearchWorkerMessage<K extends string, T> = {
  type: K;
  data: T;
};

export type LoadDataSearchWorkerMessage = GenericSearchWorkerMessage<
  'data',
  { plants: Plant[]; tags: Tags }
>;
export type SearchForSearchWorkerMessage = GenericSearchWorkerMessage<
  'search',
  string
>;
export type SearchWorkerMessage =
  | LoadDataSearchWorkerMessage
  | SearchForSearchWorkerMessage;
