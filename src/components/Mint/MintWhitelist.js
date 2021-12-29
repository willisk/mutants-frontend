import { useState, Fragment } from 'react';

import { Box, TextField, Typography } from '@mui/material';
import { Skeleton, Button, ButtonGroup } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

import { nftContractConfig } from '../../config';
import { useMintState, useNFTContract, useParty } from '../../hooks';

const { maxSupply, mintPriceWL, purchaseLimitWL } = nftContractConfig;

export default function MintWhitelist({ signature }) {
  const [mintAmount, setMintAmount] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [sig, setSig] = useState(signature);

  const { library } = useWeb3React();
  const { signContract, handleTxError, handleTx } = useNFTContract();
  const [{ publicSaleActive, totalSupply }, updateMintState] = useMintState();

  const startParty = useParty();

  const signer = library?.getSigner();

  const amountLeft = (totalSupply && maxSupply - totalSupply?.toNumber()) || 0;
  const isSoldOut = amountLeft == 0;

  const updateMintAmount = (amount) => {
    if (0 < amount && amount <= purchaseLimitWL) setMintAmount(amount);
  };

  const onMintPressed = () => {
    setIsMinting(true);
    signContract
      .whitelistMint(mintAmount, sig, { value: mintPriceWL.mul(mintAmount) })
      .then(handleTx)
      .then(startParty)
      .then(updateMintState)
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
        {mintPriceWL && !isNaN(parseInt(mintAmount)) ? (
          ethers.utils.formatEther(mintPriceWL.mul(mintAmount)).toString()
        ) : (
          <Skeleton width={40} />
        )}
      </Typography>
      <TextField
        label="Signature"
        variant="standard"
        value={sig}
        placeholder={'0x...'}
        onChange={(event) => setSig(event.target.value)}
      />
    </Fragment>
  );
}
