import circle from '@turf/circle';
import type { FeatureCollection } from 'geojson';
import { type FC, useMemo } from 'react';
import { Layer, Source } from 'react-map-gl/maplibre';
import type { Filter, FilterType } from '../../hooks/use-filters';
import theme from '../../theme';
import type { Plant } from '../../types/plant';

type PlantsProps = {
  selectedPlantId: string | undefined;
  showCanopy: boolean;
  plants: Plant[];
  filters: Filter[];
};

const hasTag = (type: FilterType, ids: string[]) => (filters: Filter[]) =>
  filters.some((f) => f.type === type && ids.includes(f.id));

const plantTagged = (plant: Plant, filters: Filter[]): boolean => {
  return (
    (plant.sponsor && hasTag('tag', ['sponsored'])(filters)) ||
    hasTag('sponsor', [plant.sponsor])(filters) ||
    hasTag('tag', plant.tags)(filters)
  );
};

const plantsToFeatureCollection = (
  plants: Plant[],
  selectedPlantId: string | undefined,
  showCanopy: boolean,
  filters: Filter[],
): FeatureCollection => {
  return {
    type: 'FeatureCollection',
    features: plants.map((plant) =>
      circle(
        [plant.position[1], plant.position[0]],
        (showCanopy || plant.width < 2 ? plant.width : 2) / 2000,
        {
          properties: {
            id: plant.id,
            code: plant.code,
            height: plant.height,
            tagged: plantTagged(plant, filters),
            selected: selectedPlantId === plant.id,
          },
        },
      ),
    ),
  };
};

const Plants: FC<PlantsProps> = ({
  plants,
  selectedPlantId,
  showCanopy,
  filters,
}) => {
  const plantFeatureCollection = useMemo(
    () =>
      plantsToFeatureCollection(plants, selectedPlantId, showCanopy, filters),
    [plants, selectedPlantId, showCanopy, filters],
  );

  return (
    <Source type="geojson" data={plantFeatureCollection}>
      <Layer
        type="fill"
        id="plant"
        paint={{
          'fill-color': [
            'case',
            ['boolean', ['get', 'selected'], false],
            'blue',
            ['boolean', ['get', 'tagged'], false],
            theme.palette.secondary.main,
            'transparent',
          ],
          'fill-opacity': 0.5,
        }}
      />
      <Layer type="line" paint={{ 'line-color': 'gray' }}></Layer>
      <Layer
        type="symbol"
        layout={{ 'text-field': ['get', 'code'] }}
        paint={{
          'text-color': theme.palette.text.primary,
          'text-halo-color': theme.palette.background.paper,
          'text-halo-width': 2,
          'text-opacity': ['step', ['zoom'], 0, 19, 1],
        }}
      />
    </Source>
  );
};

export default Plants;
