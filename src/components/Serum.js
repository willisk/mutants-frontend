import { useState, Fragment, useEffect } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { Skeleton, Button, ButtonGroup } from '@mui/material';

import { ethers, BigNumber } from 'ethers';

// import { nftContractConfig } from '../config';
import { useNFTContract, useContractState, useSerumContract, useTx } from '../lib/ContractConnector';
import { useWeb3React } from '@web3-react/core';

import { SerumContract } from '../config';
import AdminPanel from './SerumAdminPanel';

const BN = BigNumber.from;

// const { maxSupply, mintPrice, purchaseLimit, mintPriceWL, purchaseLimitWL } = nftContractConfig;

export function Serum() {
  const [claimActive, setClaimActive] = useState(false);
  const [owner, setOwner] = useState('');

  const { account, library } = useWeb3React();
  const { contract: serumContract } = useSerumContract();

  const signer = library?.getSigner();

  const updateState = async () => {
    const isActive = await serumContract.claimActive();
    const owner = await serumContract.owner();
    setClaimActive(isActive);
    setOwner(owner);
  };

  const isContractOwner =
    // true || //
    account && owner && account.toLowerCase() === owner.toLowerCase();

  useEffect(() => {
    if (account) {
      updateState();
    }
  }, [account]);

  return (
    <Fragment>
      {isContractOwner && <AdminPanel />}
      <Box marginBlock={4}>
        {claimActive ? <ClaimSerum /> : <Typography>Claiming Serum is not possible yet.</Typography>}
      </Box>
    </Fragment>
  );
}

export function ClaimSerum() {
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimActive, setClaimActive] = useState(false);

  const [checkIdInput, setCheckIdInput] = useState('');
  const [checkIdNum, setCheckIdNum] = useState('');
  const [checkIdSerumType, setCheckIdSerumType] = useState('');
  const [checkIdClaimed, setCheckIdClaimed] = useState(false);

  const [unclaimedIds, setUnclaimedIds] = useState([]);

  const { account, library } = useWeb3React();
  const { handleTx, handleTxError } = useTx();
  const { contract: nftContract } = useNFTContract();
  const { contract: serumContract, signContract } = useSerumContract();

  const signer = library?.getSigner();

  const updateState = async () => {
    const claimActive = await serumContract.claimActive();
    const tokenIds = await nftContract.tokenIdsOf(account);
    const claimed = await Promise.all(tokenIds.map((tokenId) => serumContract.claimed(tokenId)));

    const unclaimedIds = tokenIds.filter((tokenId, i) => !claimed[i]);

    setUnclaimedIds(unclaimedIds);
    setClaimActive(claimActive);

    console.log('tokenIds', tokenIds);
    console.log('unclaimedIds', unclaimedIds);
  };

  useEffect(() => {
    if (account) {
      updateState();
    }
  }, [account]);

  const onClaimAllPressed = () => {
    setIsClaiming(true);
    signContract
      .claimSerumBatch(unclaimedIds)
      .then(handleTx)
      .then(updateState)
      .catch(handleTxError)
      .finally(() => {
        setIsClaiming(false);
      });
  };

  const checkEligibility = async (tokenId) => {
    const serumType = await serumContract.tokenIdToSerumType(tokenId);
    const claimed = await serumContract.claimed(tokenId);

    setCheckIdNum(tokenId);
    setCheckIdSerumType(serumType);
    setCheckIdClaimed(claimed);
  };

  if (!claimActive) return <Typography>Claiming Serum is not possible yet.</Typography>;

  return (
    <Fragment>
      <Stack spacing={2}>
        {unclaimedIds.length == 0 ? (
          <Typography>You are not eligible to claim Serum.</Typography>
        ) : (
          <Fragment>
            <Typography>You are able to claim Serum for the following ids: {unclaimedIds.join(', ')}</Typography>
            <Box>
              <LoadingButton
                onClick={onClaimAllPressed}
                loading={isClaiming}
                disabled={!signer || isClaiming || !claimActive}
                variant="contained"
              >
                Claim All
              </LoadingButton>
            </Box>
          </Fragment>
        )}
        <TextField
          label="Check Serum Elegibility"
          variant="standard"
          value={checkIdInput}
          onChange={(event) => setCheckIdInput(event.target.value)}
          InputProps={{
            endAdornment: (
              <Button sx={{ minWidth: '110px' }} onClick={() => checkEligibility(checkIdInput)} variant="contained">
                Check Id
              </Button>
            ),
          }}
        />
        <Box display="inline-flex">
          {checkIdSerumType && (
            <Typography variant="inline">
              {`Serum for id ${checkIdNum} (Type ${checkIdSerumType.toNumber()}) `}
              {checkIdClaimed ? 'has been claimed already!' : 'has NOT been claimed yet!'}
            </Typography>
          )}
        </Box>
      </Stack>
    </Fragment>
  );
}
