import { useState } from 'react';

import { Button, TextField, Stack, Box, Accordion, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useWeb3React } from '@web3-react/core';
import { formatEther } from 'ethers/lib/utils';

import { STextFieldReadOnly } from '../defaults';

import { useMutantsContract, useMutantsState, useMutantsAdminState } from '../../hooks';

function AdminPanel() {
  const { library } = useWeb3React();
  const { contract, signContract, handleTx, handleTxError } = useMutantsContract();

  const [baseURIInput, setBaseURIInput] = useState('');
  const [revealURI, setRevealURI] = useState('');
  const [secretPass, setSecretPass] = useState('');
  const [forceMegaId, setForceMegaId] = useState('');

  const [{ publicSaleActive, mutationsActive }, updateState] = useMutantsState();
  const [{ randomSeedSet, baseURI, balance }, updateAdminState] = useMutantsAdminState();

  const signer = library?.getSigner();

  return (
    <Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography margin="auto">Admin Panel</Typography>
        </AccordionSummary>
        <Typography variant="h4">Mutation Contract Details</Typography>
        <Box maxWidth={600} margin="auto" padding={5}>
          <Stack spacing={2}>
            <STextFieldReadOnly label="Address" value={contract?.address} />
            <STextFieldReadOnly
              label="Public Sale"
              value={publicSaleActive ? 'live' : 'paused'}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() =>
                      signContract
                        .setPublicSaleActive(!publicSaleActive)
                        .then(handleTx)
                        .then(updateState)
                        .catch(handleTxError)
                    }
                    disabled={!signer || publicSaleActive == null}
                    variant="contained"
                  >
                    {publicSaleActive ? 'pause' : 'activate'}
                  </Button>
                ),
              }}
            />
            <STextFieldReadOnly
              label="Mutations Active"
              value={mutationsActive ? 'live' : 'paused'}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() =>
                      signContract
                        .setMutationsActive(!mutationsActive)
                        .then(handleTx)
                        .then(updateState)
                        .catch(handleTxError)
                    }
                    disabled={!signer || mutationsActive == null}
                    variant="contained"
                  >
                    {mutationsActive ? 'pause' : 'activate'}
                  </Button>
                ),
              }}
            />
            <STextFieldReadOnly
              label="Random Seed"
              value={randomSeedSet ? 'set' : 'unset'}
              InputProps={{
                endAdornment: (
                  <Box display="flex" flexDirection="row" gap={1}>
                    <Button
                      onClick={() =>
                        signContract.forceFulfillRandomness().then(handleTx).then(updateAdminState).catch(handleTxError)
                      }
                      disabled={!signer || randomSeedSet}
                      variant="contained"
                    >
                      force
                    </Button>
                    <Button
                      onClick={() =>
                        signContract.requestRandomSeed().then(handleTx).then(updateAdminState).catch(handleTxError)
                      }
                      disabled={!signer || randomSeedSet}
                      variant="contained"
                    >
                      request
                    </Button>
                  </Box>
                ),
              }}
            />
            <TextField
              label="Force Mega Id"
              variant="standard"
              value={forceMegaId}
              onChange={(event) => setForceMegaId(event.target.value)}
              InputProps={{
                endAdornment: (
                  <Box display="flex" flexDirection="row" gap={1}>
                    <Button
                      onClick={() =>
                        signContract
                          .forceFulfillRandomMegaMutant(forceMegaId)
                          .then(handleTx)
                          .then(updateAdminState)
                          .catch(handleTxError)
                      }
                      disabled={!signer}
                      variant="contained"
                    >
                      force
                    </Button>
                  </Box>
                ),
              }}
            />
            <STextFieldReadOnly
              label="Balance"
              value={' Ξ ' + parseFloat(formatEther('' + balance)).toFixed(4)}
              InputProps={{
                endAdornment: (
                  <Button
                    variant="contained"
                    onClick={() => signContract.withdraw().then(handleTx).then(updateAdminState).catch(handleTxError)}
                    disabled={!signer}
                  >
                    withdraw
                  </Button>
                ),
              }}
            />
            <TextField
              label="Base URI"
              variant="standard"
              value={baseURIInput || baseURI}
              placeholder={baseURI}
              onChange={(event) => setBaseURIInput(event.target.value)}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() =>
                      signContract.setBaseURI(baseURIInput).then(handleTx).then(updateAdminState).catch(handleTxError)
                    }
                    disabled={!signer}
                    variant="contained"
                  >
                    set
                  </Button>
                ),
              }}
            />
          </Stack>
        </Box>
      </Accordion>
    </Box>
  );
}
export default AdminPanel;
