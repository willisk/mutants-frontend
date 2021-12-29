import { Fragment } from 'react';

import { Stack, Typography } from '@mui/material';

import { useMutantsAccountState } from '../../hooks';

export default function MutantsInfo() {
  const [{ tokenIds, serumIds }] = useMutantsAccountState();

  const serumIdsSum = serumIds[0] + serumIds[1] + serumIds[2];

  return (
    <Fragment>
      <Stack spacing={2}>
        {tokenIds.length === 0 ? (
          <Typography>You do not hold any token ids.</Typography>
        ) : (
          <Typography>You hold the following token ids: {tokenIds.join(', ')}.</Typography>
        )}
        {serumIdsSum === 0 ? (
          <Typography>You do not hold any serum.</Typography>
        ) : (
          <Fragment>
            <Typography>You hold the following serum balances</Typography>
            <Typography>
              type 1: {serumIds[0]}, type 2: {serumIds[1]}, type 3: {serumIds[2]}.
            </Typography>
          </Fragment>
        )}
      </Stack>
    </Fragment>
  );
}
