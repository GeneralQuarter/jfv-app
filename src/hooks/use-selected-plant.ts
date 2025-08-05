import { useMemo } from 'react';
import type { Plant } from '../types/plant';

export default function useSelectedPlant(
  plants: Plant[],
  selectedPlantId: string | undefined,
): Plant | undefined {
  return useMemo<Plant | undefined>(
    () =>
      selectedPlantId
        ? plants.find((p) => p.id === selectedPlantId)
        : undefined,
    [plants, selectedPlantId],
  );
}
