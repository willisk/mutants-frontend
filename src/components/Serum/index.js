import { Fragment } from 'react';

import { Box, Typography } from '@mui/material';

import AdminPanel from './SerumAdminPanel';
import ClaimSerum from './ClaimSerum';

import { useSerumState } from '../../hooks';

export default function Serum() {
  const [{ isContractOwner, claimActive }] = useSerumState();

  return (
    <Fragment>
      {isContractOwner && <AdminPanel />}
      <Box marginBlock={4}>
        {claimActive ? <ClaimSerum /> : <Typography>Claiming Serum is not possible yet.</Typography>}
      </Box>
    </Fragment>
  );
}
