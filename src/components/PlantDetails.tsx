import { Chip, Stack, Typography } from '@mui/material';
import type { FC } from 'react';
import useDateTimeFormat from '../hooks/use-date-time-format';
import useNumberFormat from '../hooks/use-number-format';
import type { Plant } from '../types/plant';
import type { Tags } from '../types/tags';

type PlantDetailsProps = {
  plant: Plant;
  tags: Tags;
};

const PlantDetails: FC<PlantDetailsProps> = ({ plant, tags }) => {
  const plantedAt = useDateTimeFormat(plant.plantedAt, 'fr', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
  const width = useNumberFormat(plant.width, 'fr', {
    style: 'unit',
    unit: 'meter',
  });
  const height = useNumberFormat(plant.height, 'fr', {
    style: 'unit',
    unit: 'meter',
  });

  return (
    <Stack>
      {plantedAt && (
        <Typography variant="body2">
          Planté le{' '}
          <Typography variant="subtitle2" component="span">
            {plantedAt}
          </Typography>
        </Typography>
      )}
      <Typography variant="h5">{plant.fullLatinName}</Typography>
      <Typography variant="subtitle1">{plant.commonName}</Typography>
      <Typography mt={1}>
        {width} x {height}
      </Typography>
      {plant.sponsor && (
        <Typography variant="body2">
          Parrainé par{' '}
          <Typography color="secondary" component="span">
            {plant.sponsor}
          </Typography>
        </Typography>
      )}
      <Stack flexDirection="row" gap={1} mt={2} flexWrap="wrap">
        {plant.tags.map((t) => (
          <Chip key={t} label={tags[t]} />
        ))}
      </Stack>
    </Stack>
  );
};

export default PlantDetails;
