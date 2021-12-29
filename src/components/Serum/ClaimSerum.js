import { useState, Fragment } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { Button } from '@mui/material';

import { useSerumClaimState, useSerumContract, useSerumState, useTx } from '../../hooks';
import { useWeb3React } from '@web3-react/core';

export default function ClaimSerum() {
  const [isClaiming, setIsClaiming] = useState(false);

  const [checkIdInput, setCheckIdInput] = useState('');
  const [checkIdNum, setCheckIdNum] = useState('');
  const [checkIdSerumType, setCheckIdSerumType] = useState('');
  const [checkIdClaimed, setCheckIdClaimed] = useState(false);

  const { library } = useWeb3React();
  const { handleTx, handleTxError } = useTx();
  const { contract: serumContract, signContract } = useSerumContract();

  const [{ claimActive, tokenIds, claimed, unclaimedIds }, updateClaimState] = useSerumClaimState();

  const signer = library?.getSigner();

  const onClaimAllPressed = () => {
    setIsClaiming(true);
    signContract
      .claimSerumBatch(unclaimedIds)
      .then(handleTx)
      .then(updateClaimState)
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
