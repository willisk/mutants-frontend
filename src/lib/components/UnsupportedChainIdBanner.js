import { Box } from '@mui/material';

import { useWeb3React } from '@web3-react/core';
import { config } from '../../config';

export function UnsupportedChainIdBanner() {
  const { error } = useWeb3React();

  if (error?.name === 'UnsupportedChainIdError')
    return (
      <Box className="invalid-network-banner" sx={{ background: 'orange', color: 'black' }}>
        Warning: Unsupported chain id. Please switch to the {config.validChainName} network.
      </Box>
    );
  return null;
}
