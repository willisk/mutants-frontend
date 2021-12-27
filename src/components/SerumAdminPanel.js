import './MintAdminPanel';
import React, { Fragment, useEffect } from 'react';
import { useMemo, useState, useContext } from 'react';
import { Button, TextField, Stack, Box, Accordion, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { STextFieldReadOnly } from './defaults';
import { useWeb3React } from '@web3-react/core';
import { useMutantsContract, useSerumContract } from '../lib/ContractConnector';
import { formatEther } from 'ethers/lib/utils';
import { signGiveaway } from '../lib/utils';
import { config } from '../config';
import { useMintState } from './Mint';

const { NFTAddress } = config;

const initialContractInfo = {
  name: '',
  symbol: '',
  baseURI: '',
  balance: '0',
};

function AdminPanel() {
  const { account, library } = useWeb3React();
  const { contract, signContract, handleTx, handleTxError } = useSerumContract();

  const [baseURIInput, setBaseURIInput] = useState('');

  const [{ baseURI, balance, randomSeedSet, megaIdsSet }, setContractInfo] = useState(initialContractInfo);

  const signer = library?.getSigner();

  const updateAdminInfo = async () =>
    setContractInfo({
      baseURI: await contract.baseURI(),
      balance: await contract?.provider.getBalance(contract.address),
      randomSeedSet: await contract.randomSeedSet(),
      megaIdsSet: await contract.megaIdsSet(),
    });

  useEffect(() => {
    updateAdminInfo();
  }, []);

  return (
    <Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography margin="auto">Admin Panel</Typography>
        </AccordionSummary>
        <Typography variant="h4">Serum Contract Details</Typography>
        <Box maxWidth={600} margin="auto" padding={5}>
          <Stack spacing={2}>
            <STextFieldReadOnly label="Address" value={contract?.address} />
            <STextFieldReadOnly
              label="Random Seed"
              value={randomSeedSet ? 'set' : 'unset'}
              InputProps={{
                endAdornment: (
                  <Box display="flex" flexDirection="row" gap={1}>
                    <Button
                      onClick={() =>
                        signContract.forceFulfillRandomness().then(handleTx).then(updateAdminInfo).catch(handleTxError)
                      }
                      disabled={!signer || randomSeedSet}
                      variant="contained"
                    >
                      force
                    </Button>
                    <Button
                      onClick={() =>
                        signContract.requestRandomSeed().then(handleTx).then(updateAdminInfo).catch(handleTxError)
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
            <STextFieldReadOnly
              label="Mega Id Sequence"
              value={megaIdsSet ? 'set' : 'unset'}
              InputProps={{
                endAdornment: (
                  <Button
                    sx={{ width: '220px' }}
                    onClick={() =>
                      signContract.setMegaSequence().then(handleTx).then(updateAdminInfo).catch(handleTxError)
                    }
                    disabled={!signer || megaIdsSet || !randomSeedSet}
                    variant="contained"
                  >
                    set sequence
                  </Button>
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
                    onClick={() => signContract.withdraw().then(handleTx).then(updateAdminInfo).catch(handleTxError)}
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
                      signContract.setBaseURI(baseURIInput).then(handleTx).then(updateAdminInfo).catch(handleTxError)
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