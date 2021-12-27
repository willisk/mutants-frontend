import { useMemo, useState, useContext, useEffect, Fragment, createContext } from 'react';
import Countdown from 'react-countdown';
import Confetti from 'react-confetti';

import LoadingButton from '@mui/lab/LoadingButton';
import MuiAlert from '@mui/material/Alert';
import { Box, TextField, Typography } from '@mui/material';
import { Skeleton, Snackbar, Button, ButtonGroup } from '@mui/material';

import { ethers, BigNumber } from 'ethers';

import { SStack, STextField, STextFieldReadOnly, SDateTimePicker } from './defaults';

import { nftContractConfig } from '../config';
// import { useNFTContract, useContractState } from '../lib/ContractConnector';
import { useWeb3React } from '@web3-react/core';
import useWindowSize from 'react-use/lib/useWindowSize';
import AdminPanel from './MintAdminPanel';

import { whitelist, diamondlist } from '../data/whitelist';
import { useContractContext, useNFTContract } from '../lib/ContractConnector';

const { maxSupply, mintPrice, purchaseLimit, mintPriceWL, purchaseLimitWL } = nftContractConfig;
const BN = BigNumber.from;

export const MintContext = createContext({});

export const getContractState = async (contract) => {
  console.log('calling update state');
  if (contract == undefined) return {};
  console.log('fetching update state');

  const owner = await contract.owner();
  const name = await contract.name();
  const symbol = await contract.symbol();
  const publicSaleActive = await contract.publicSaleActive();
  const whitelistActive = await contract.whitelistActive();
  const diamondlistActive = await contract.diamondlistActive();
  const totalSupply = await contract.totalSupply();

  // const items = await Promise.all(
  //   [...Array(totalSupply.toNumber())].map(async (_, i) => ({
  //     id: i,
  //     uri: await contract.tokenURI(i),
  //     // type: await contract.idToType(i),
  //   }))
  // );

  return {
    // address: contract.address,
    owner: owner,
    name: name,
    symbol: symbol,
    publicSaleActive: publicSaleActive,
    whitelistActive: whitelistActive,
    diamondlistActive: diamondlistActive,
    totalSupply: totalSupply,
    // items: items,
    loaded: true,
  };
};

export function useMintState() {
  return useContext(MintContext);
}

export function Mint() {
  const [confetti, setConfetti] = useState(false);
  const [confettiRunning, setConfettiRunning] = useState(false);

  const [mintState, setMintState] = useState({});

  const { account, library } = useWeb3React();
  const { width, height } = useWindowSize();
  const { contract } = useNFTContract();

  const updateMintState = () => {
    getContractState(contract).then(setMintState);
  };

  useEffect(() => {
    if (library?.provider) {
      contract.on(contract.filters.PublicSaleStateUpdate(), updateMintState); // needs proper cleanup
      updateMintState();
    }
  }, [library?.provider]);

  const startParty = () => {
    setConfetti(true);
    setConfettiRunning(true);
    setTimeout(() => setConfetti(false), 800);
  };

  return (
    <MintContext.Provider value={{ ...mintState, updateMintState }}>
      <AdminPanel />
      <Box display="flex" flexDirection="column" justifyContent="space-between" marginBlock={10}>
        <Confetti
          width={width}
          height={height}
          numberOfPieces={200}
          run={confettiRunning}
          recycle={confetti}
          gravity={0.1}
        />
        {diamondlist[account] ? (
          <Box marginBlock={4}>
            <Typography variant="h4">Diamondlist</Typography>
            <Typography>You are eligible.</Typography>
            <MintDiamondlist startParty={startParty} signature={diamondlist[account]} />
          </Box>
        ) : whitelist[account] ? (
          <Box marginBlock={4}>
            <Typography variant="h4">Whitelist</Typography>
            <Typography>You are eligible.</Typography>
            <MintWhitelist startParty={startParty} signature={whitelist[account]} />
          </Box>
        ) : (
          <Box marginBlock={4}>
            <MintPublic startParty={startParty} />
          </Box>
        )}
        {/* <Box marginBlock={4}>
          <MintPublic startParty={startParty} />
        </Box>
        <Box marginBlock={4}>
          <Typography variant="h4">Whitelist</Typography>
          <MintWhitelist startParty={startParty} />
        </Box>
        <Box marginBlock={4}>
          <Typography variant="h4">Diamondlist</Typography>
          <MintDiamondlist startParty={startParty} />
        </Box> */}
      </Box>
    </MintContext.Provider>
  );
}

function MintPublic({ startParty }) {
  const [mintAmount, setMintAmount] = useState(1);
  const [isMinting, setIsMinting] = useState(false);

  const { library } = useWeb3React();
  const { signContract, handleTxError, handleTx } = useNFTContract();
  const { publicSaleActive, totalSupply, updateMintState } = useMintState();

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

function MintWhitelist({ startParty, signature }) {
  const [mintAmount, setMintAmount] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [sig, setSig] = useState(signature);

  const { library } = useWeb3React();
  const { signContract, handleTxError, handleTx } = useNFTContract();
  const { publicSaleActive, totalSupply, updateMintState } = useMintState();

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

function MintDiamondlist({ startParty, signature }) {
  const [isMinting, setIsMinting] = useState(false);
  const [sig, setSig] = useState(signature);

  const { library } = useWeb3React();
  const { signContract, handleTxError, handleTx } = useNFTContract();
  const { diamondlistActive, totalSupply, updateMintState } = useMintState();

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
