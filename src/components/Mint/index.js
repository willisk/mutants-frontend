import { Fragment } from 'react';
// import Countdown from 'react-countdown';

import { Box, Typography } from '@mui/material';

import { useWeb3React } from '@web3-react/core';

import AdminPanel from './MintAdminPanel';

import MintPublic from './MintPublic';
import MintDiamondlist from './MintDiamondlist';
import MintWhitelist from './MintWhitelist';

// import { whitelist, diamondlist } from '../../data/whitelist';
import { whitelist } from '../../data/whitelistSignatures';
import { useMintState } from '../../hooks';

export default function Mint() {
  const { account } = useWeb3React();
  const [{ isContractOwner, publicSaleActive, whitelistActive, diamondlistActive }] = useMintState();

  return (
    <Fragment>
      {isContractOwner && <AdminPanel />}
      <Box display="flex" flexDirection="column" justifyContent="space-between" marginBlock={10}>
        {whitelist[1337][account?.toLowerCase()] && (
          <Box marginBlock={4}>
            <Typography variant="h4">Diamondlist</Typography>
            <Typography>You are eligible.</Typography>
            {diamondlistActive ? (
              <MintDiamondlist signature={whitelist[1337][account?.toLowerCase()]} />
            ) : (
              <Typography>Diamond list is not enabled yet.</Typography>
            )}
          </Box>
        )}
        {whitelist[69][account?.toLowerCase()] && (
          <Box marginBlock={4}>
            <Typography variant="h4">Whitelist</Typography>
            <Typography>You are eligible.</Typography>
            {whitelistActive ? (
              <MintWhitelist signature={whitelist[69][account?.toLowerCase()]} />
            ) : (
              <Typography>Whitelist is not enabled yet.</Typography>
            )}
          </Box>
        )}
        <Box marginBlock={4}>
          {publicSaleActive ? <MintPublic /> : <Typography>Public sale is not enabled yet.</Typography>}
        </Box>
      </Box>
    </Fragment>
  );
}
