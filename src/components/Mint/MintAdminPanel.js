import { useState } from 'react';

import { Button, TextField, Stack, Box, Accordion, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useWeb3React } from '@web3-react/core';
import { formatEther } from 'ethers/lib/utils';

import { STextFieldReadOnly } from '../defaults';

import { signGiveaway } from '../../lib/utils';
import { config } from '../../config';
import { useNFTContract, useMintState, useMintAdminState } from '../../hooks';

const { NFTAddress } = config;

export default function AdminPanel() {
  const { library } = useWeb3React();
  const { contract, signContract, handleTx, handleTxError } = useNFTContract();

  const [baseURIInput, setBaseURIInput] = useState('');
  const [whitelist, setWhitelist] = useState('');
  const [whitelistSig, setWhitelistSig] = useState('');
  const [diamondlist, setDiamondlist] = useState('');
  const [diamondlistSig, setDiamondlistSig] = useState('');

  const [{ owner, publicSaleActive, whitelistActive, diamondlistActive }, updateMintState] = useMintState();
  const [{ name, symbol, baseURI, balance, randomSeedSet }, updateAdminInfo] = useMintAdminState();

  const signer = library?.getSigner();

  return (
    <Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography margin="auto">Admin Panel</Typography>
        </AccordionSummary>
        <Typography variant="h4">Contract Details</Typography>
        <Box maxWidth={600} margin="auto" padding={5}>
          <Stack spacing={2}>
            <STextFieldReadOnly label="Address" value={contract?.address} />
            <STextFieldReadOnly label="Owner" value={owner} />
            <Stack direction="row">
              <STextFieldReadOnly sx={{ width: '100%' }} label="Name" value={name} />
              <STextFieldReadOnly sx={{ width: '100%' }} label="Symbol" value={symbol} />
            </Stack>
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
                        .then(updateMintState)
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
              label="Whitelist"
              value={whitelistActive ? 'live' : 'paused'}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() =>
                      signContract
                        .setWhitelistActive(!whitelistActive)
                        .then(handleTx)
                        .then(updateMintState)
                        .catch(handleTxError)
                    }
                    disabled={!signer || whitelistActive == null}
                    variant="contained"
                  >
                    {whitelistActive ? 'pause' : 'activate'}
                  </Button>
                ),
              }}
            />
            <STextFieldReadOnly
              label="Diamondlist"
              value={diamondlistActive ? 'live' : 'paused'}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() =>
                      signContract
                        .setDiamondlistActive(!diamondlistActive)
                        .then(handleTx)
                        .then(updateMintState)
                        .catch(handleTxError)
                    }
                    disabled={!signer || diamondlistActive == null}
                    variant="contained"
                  >
                    {diamondlistActive ? 'pause' : 'activate'}
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
            <TextField
              label="Whitelist"
              variant="standard"
              value={whitelist}
              placeholder={'0x...'}
              onChange={(event) => setWhitelist(event.target.value)}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() =>
                      signGiveaway(signer, NFTAddress, whitelist, 69).then(setWhitelistSig).catch(handleTxError)
                    }
                    disabled={!signer}
                    variant="contained"
                  >
                    sign
                  </Button>
                ),
              }}
            />
            {whitelistSig && <STextFieldReadOnly label="Whitelist Signature" value={whitelistSig} />}
            <TextField
              label="Diamondlist"
              variant="standard"
              value={diamondlist}
              placeholder={'0x...'}
              onChange={(event) => setDiamondlist(event.target.value)}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() =>
                      signGiveaway(signer, NFTAddress, diamondlist, 1337).then(setDiamondlistSig).catch(handleTxError)
                    }
                    disabled={!signer}
                    variant="contained"
                  >
                    sign
                  </Button>
                ),
              }}
            />
            {diamondlistSig && <STextFieldReadOnly label="Diamondlist Signature" value={diamondlistSig} />}
          </Stack>
        </Box>
      </Accordion>
    </Box>
  );
}
