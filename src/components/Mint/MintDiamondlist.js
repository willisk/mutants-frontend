import { useState, Fragment } from 'react';

import { Box, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useWeb3React } from '@web3-react/core';

import { nftContractConfig } from '../../config';
import { useMintState, useNFTContract, useParty } from '../../hooks';

const { maxSupply } = nftContractConfig;

export default function MintDiamondlist({ signature }) {
  const [isMinting, setIsMinting] = useState(false);
  const [sig, setSig] = useState(signature);

  const { library } = useWeb3React();
  const { signContract, handleTxError, handleTx } = useNFTContract();
  const [{ diamondlistActive, totalSupply }, updateMintState] = useMintState();

  const startParty = useParty();

  const signer = library?.getSigner();

  const amountLeft = (totalSupply && maxSupply - totalSupply?.toNumber()) || 0;
  const isSoldOut = amountLeft == 0;

  const onMintPressed = () => {
    setIsMinting(true);
    signContract
      .diamondlistMint(sig)
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
          disabled={!signer || isMinting || !diamondlistActive || isSoldOut}
          variant="contained"
        >
          {isSoldOut ? 'SOLD OUT!' : <span className="mint-button-text">MINT</span>}
        </LoadingButton>
      </Box>
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
