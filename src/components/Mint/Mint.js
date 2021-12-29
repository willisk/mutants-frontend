import { useState, Fragment } from 'react';
// import Countdown from 'react-countdown';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, TextField, Typography } from '@mui/material';
import { Skeleton, Button, ButtonGroup } from '@mui/material';

import { ethers } from 'ethers';

import { nftContractConfig } from '../../config';
import { useWeb3React } from '@web3-react/core';
import { useParty } from '../../hooks/useParty';
import AdminPanel from './MintAdminPanel';

import { whitelist, diamondlist } from '../../data/whitelist';
import { useNFTContract } from '../../lib/ContractConnector';

import { useMintState } from '../../hooks/useMintState';

const { maxSupply, mintPrice, purchaseLimit, mintPriceWL, purchaseLimitWL } = nftContractConfig;

export function Mint() {
  const { account } = useWeb3React();

  return (
    <Fragment>
      <AdminPanel />
      <Box display="flex" flexDirection="column" justifyContent="space-between" marginBlock={10}>
        {diamondlist[account] && (
          <Box marginBlock={4}>
            <Typography variant="h4">Diamondlist</Typography>
            <Typography>You are eligible.</Typography>
            <MintDiamondlist signature={diamondlist[account]} />
          </Box>
        )}
        {whitelist[account] && (
          <Box marginBlock={4}>
            <Typography variant="h4">Whitelist</Typography>
            <Typography>You are eligible.</Typography>
            <MintWhitelist signature={whitelist[account]} />
          </Box>
        )}
        <Box marginBlock={4}>
          <MintPublic />
        </Box>
      </Box>
    </Fragment>
  );
}

function MintPublic() {
  const [mintAmount, setMintAmount] = useState(1);
  const [isMinting, setIsMinting] = useState(false);

  const { library } = useWeb3React();
  const { signContract, handleTxError, handleTx } = useNFTContract();
  const [{ publicSaleActive, totalSupply }, updateMintState] = useMintState();

  const { startParty } = useParty();

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

function MintWhitelist({ signature }) {
  const [mintAmount, setMintAmount] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [sig, setSig] = useState(signature);

  const { library } = useWeb3React();
  const { signContract, handleTxError, handleTx } = useNFTContract();
  const [{ publicSaleActive, totalSupply }, updateMintState] = useMintState();

  const { startParty } = useParty();

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

function MintDiamondlist({ signature }) {
  const [isMinting, setIsMinting] = useState(false);
  const [sig, setSig] = useState(signature);

  const { library } = useWeb3React();
  const { signContract, handleTxError, handleTx } = useNFTContract();
  const [{ diamondlistActive, totalSupply }, updateMintState] = useMintState();

  const { startParty } = useParty();

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
