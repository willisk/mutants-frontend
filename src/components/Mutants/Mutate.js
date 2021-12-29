import { useState, Fragment } from 'react';

import { Box, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Button } from '@mui/material';

import { useMutantsContract } from '../../hooks';

export default function Mutate() {
  const [id, setId] = useState('');
  const [SerumType, setSerumType] = useState(0);

  const { signContract, handleTx, handleTxError } = useMutantsContract();

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
                      Type {i + 1}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  onClick={() => signContract.mutate(id, SerumType).then(handleTx).catch(handleTxError)}
                  variant="contained"
                >
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
