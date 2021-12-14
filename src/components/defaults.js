import React from 'react';
import { styled, MenuItem, Button, TextField, Stack, InputAdornment } from '@mui/material';

import DateTimePicker from '@mui/lab/DateTimePicker';

const StyledStack = styled(Stack)(({ theme }) => ({
  padding: '2em 1em',
  maxWidth: 600,
  margin: 'auto',
  textAlign: 'center',
}));

export const DStack = (props) => <StyledStack spacing={2} {...props} />;
export const DTextField = (props) => <TextField variant="outlined" {...props} />;
export const DTextFieldInfo = (props) => (
  <DTextField
    variant="standard"
    inputProps={{
      readOnly: true,
    }}
    {...props}
  />
);
export const DDateTimePicker = ({ error, helperText, ...props }) => (
  <DateTimePicker
    {...props}
    renderInput={(params) => <DTextField {...params} error={error} helperText={helperText} />}
  />
);
