import { useState, Fragment } from 'react';

import { Box, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Button } from '@mui/material';

import { useMutantsContract, useTx } from '../../hooks';

export default function MutantsEligibility() {
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
                      Type {i + 1}
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
