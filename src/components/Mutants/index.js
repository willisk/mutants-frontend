import { Fragment } from 'react';

import { Stack, Typography } from '@mui/material';

import AdminPanel from './MutantsAdminPanel';
import { useMutantsState } from '../../hooks';

import MutantsEligibility from './MutantsEligibility';
import MutantsInfo from './MutantsInfo';
import Mutate from './Mutate';
import MutantsPublicMint from './MutantsPublicMint';

export default function Mutants() {
  const [{ isContractOwner, publicSaleActive, mutationsActive }] = useMutantsState();

  return (
    <Fragment>
      {isContractOwner && <AdminPanel />}
      <Stack marginBlock={4} spacing={2}>
        {!publicSaleActive ? (
          <Typography>Public Sale is not active yet.</Typography>
        ) : (
          <Stack marginBlock={4} spacing={2}>
            <MutantsPublicMint />
          </Stack>
        )}
        {!mutationsActive ? (
          <Typography>Mutating is not possible yet.</Typography>
        ) : (
          <Stack marginBlock={4} spacing={4}>
            <MutantsInfo />
            <MutantsEligibility />
            <Mutate />
          </Stack>
        )}
      </Stack>
    </Fragment>
  );
}
