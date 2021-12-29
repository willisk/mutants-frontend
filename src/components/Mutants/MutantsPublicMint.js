import { useState, Fragment, useEffect } from 'react';

import { Box, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Skeleton, Button, ButtonGroup } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

import { useMutantsContract, useMutantsState, useParty } from '../../hooks';
import { mutantsContractConfig } from '../../config';

export default function MutantsPublicMint() {
  const [mintAmount, setMintAmount] = useState(1);
  const [isMinting, setIsMinting] = useState(false);

  const { library } = useWeb3React();
  const { signContract, handleTx, handleTxError } = useMutantsContract();

  const [{ publicSaleActive, numPublicMinted: totalSupply }, updateState] = useMutantsState();
  const { maxSupply, mintPrice, purchaseLimit } = mutantsContractConfig;

  const startParty = useParty();

  const signer = library?.getSigner();

  const amountLeft = (totalSupply && maxSupply - totalSupply?.toNumber()) || 0;
  const isSoldOut = amountLeft == 0;

  const updateMintAmount = (amount) => {
    if (0 < amount && amount <= purchaseLimit) setMintAmount(amount);
  };

  const onMintPressed = () => {
    setIsMinting(true);
    signContract
      .mint(mintAmount, { value: mintPrice.mul(mintAmount) })
      .then(handleTx)
      .then(startParty)
      .then(updateState)
      .catch(handleTxError)
      .finally(() => {
        setIsMinting(false);
      });
  };

  return (
    <Fragment>
      <Box>
        <LoadingButton
          onClick={onMintPressed}
          loading={isMinting}
          disabled={!signer || isMinting || !publicSaleActive || isSoldOut}
          variant="contained"
        >
          {isSoldOut ? 'SOLD OUT!' : <span className="mint-button-text">MINT</span>}
        </LoadingButton>
      </Box>
      <Box>
        <ButtonGroup size="small" variant="outlined">
          <Button
            variant="text"
            onClick={() => {
              updateMintAmount(mintAmount - 1);
            }}
          >
            -
          </Button>
          <Button variant="text">{mintAmount}</Button>
          <Button
            variant="text"
            onClick={() => {
              updateMintAmount(mintAmount + 1);
            }}
          >
            +
          </Button>
        </ButtonGroup>
      </Box>
      <Typography>
        Price:{' Ξ '}
        {mintPrice && !isNaN(parseInt(mintAmount)) ? (
          ethers.utils.formatEther(mintPrice.mul(mintAmount)).toString()
        ) : (
          <Skeleton width={40} />
        )}
      </Typography>
      <Box>
        {totalSupply == null ? <Skeleton width={40} /> : <span id="supplyMinted">{totalSupply?.toString()}</span>}
        {' / '}
        {maxSupply} Minted
      </Box>
    </Fragment>
  );
}
