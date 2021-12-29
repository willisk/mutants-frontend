import { useState, Fragment, useEffect } from 'react';

import { Stack, Typography } from '@mui/material';

import { useWeb3React } from '@web3-react/core';

import { useNFTContract, useSerumContract } from '../../hooks';

export default function MutantsInfo() {
  const [tokenIds, setTokenIds] = useState([]);
  const [serumIds, setSerumIds] = useState([0, 0, 0]);

  const { account, library } = useWeb3React();
  const { contract: nftContract } = useNFTContract();
  const { contract: serumContract } = useSerumContract();

  const updateState = async () => {
    const tokenIds = await nftContract.tokenIdsOf(account);
    const serumIds = await serumContract.balanceOfBatch(Array(3).fill(account), [0, 1, 2]);

    setTokenIds(tokenIds);
    setSerumIds(serumIds.map((i) => i.toNumber()));
  };

  const serumIdsSum = serumIds[0] + serumIds[1] + serumIds[2];

  useEffect(() => {
    if (account && library?.getSigner()) {
      updateState();
    }
  }, [account]);

  return (
    <Fragment>
      <Stack spacing={2}>
        {tokenIds.length == 0 ? (
          <Typography>You do not hold any token ids.</Typography>
        ) : (
          <Typography>You hold the following token ids: {tokenIds.join(', ')}.</Typography>
        )}
        {serumIdsSum == 0 ? (
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
