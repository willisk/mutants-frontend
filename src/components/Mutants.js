import { useState, Fragment, useEffect, createContext, useContext } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Skeleton, Button, ButtonGroup } from '@mui/material';

import { ethers } from 'ethers';

import { useNFTContract, useSerumContract, useTx, useMutantsContract } from '../lib/ContractConnector';
import { useWeb3React } from '@web3-react/core';

import AdminPanel from './MutantsAdminPanel';
import { mutantsContractConfig } from '../config';

import { useMutantsContext } from '../hooks/useMutantsContext';

export function Mutants() {
  const [{ isContractOwner, publicSaleActive, mutationsActive }, updateState] = useMutantsContext();

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

export function MutantsInfo() {
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

export function MutantsEligibility() {
  const [checkId, setCheckId] = useState('');
  const [checkSerumType, setCheckSerumType] = useState(0);
  const [checkOutput, setCheckOutput] = useState('');

  const { handleTxError } = useTx();
  const { contract: mutantsContract } = useMutantsContract();

  const checkEligibility = async () => {
    const canMutate = await mutantsContract.canMutate(checkId, checkSerumType).catch(handleTxError);
    const checkOutput = canMutate
      ? `Id ${checkId} is able to mutate with serum type ${checkSerumType}.`
      : `Id ${checkId} is NOT able to mutate with serum type ${checkSerumType}.`;

    setCheckOutput(checkOutput);
  };

  return (
    <Fragment>
      <Stack spacing={2}>
        <Typography variant="h4">Check Mutation Eligibility</Typography>
        <TextField
          label="Check Elegibility"
          variant="standard"
          value={checkId}
          onChange={(event) => setCheckId(event.target.value)}
          placeholder="123.."
          InputProps={{
            endAdornment: (
              <Box display="flex" flexDirection="row" gap={1}>
                <TextField
                  select
                  label="Serum Type"
                  value={checkSerumType}
                  onChange={(event) => setCheckSerumType(event.target.value)}
                >
                  {[...Array(3)].map((_, i) => (
                    <MenuItem key={i} value={i}>
                      Type {i}
                    </MenuItem>
                  ))}
                </TextField>
                <Button onClick={checkEligibility} variant="contained">
                  Check
                </Button>
              </Box>
            ),
          }}
        />
        {checkOutput && <Typography>{checkOutput}</Typography>}
      </Stack>
    </Fragment>
  );
}

export function Mutate() {
  const [id, setId] = useState('');
  const [SerumType, setSerumType] = useState(0);

  const { signContract, handleTx, handleTxError } = useMutantsContract();

  const onMutatePressed = async () => {
    await signContract.mutate(id, SerumType).then(handleTx).catch(handleTxError);
  };

  return (
    <Fragment>
      <Stack spacing={2}>
        <Typography variant="h4">Mutate</Typography>
        <TextField
          label="Mutate Id"
          variant="standard"
          value={id}
          onChange={(event) => setId(event.target.value)}
          placeholder="123.."
          InputProps={{
            endAdornment: (
              <Box display="flex" flexDirection="row" gap={1}>
                <TextField
                  select
                  label="Serum Type"
                  value={SerumType}
                  onChange={(event) => setSerumType(event.target.value)}
                >
                  {[...Array(3)].map((_, i) => (
                    <MenuItem key={i} value={i}>
                      Type {i}
                    </MenuItem>
                  ))}
                </TextField>
                <Button onClick={onMutatePressed} variant="contained">
                  Mutate
                </Button>
              </Box>
            ),
          }}
        />
      </Stack>
    </Fragment>
  );
}

export function MutantsPublicMint() {
  const [mintAmount, setMintAmount] = useState(1);
  const [isMinting, setIsMinting] = useState(false);

  const { library } = useWeb3React();
  const { signContract, handleTx, handleTxError } = useMutantsContract();

  const [{ publicSaleActive, numPublicMinted: totalSupply }, updateState] = useMutantsContext();
  const { maxSupply, mintPrice, purchaseLimit } = mutantsContractConfig;

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
      // .then(startParty)
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
