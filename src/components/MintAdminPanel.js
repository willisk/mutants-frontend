import './MintAdminPanel';
import React, { useEffect } from 'react';
import { useMemo, useState, useContext } from 'react';
import { Button, TextField, Stack, Box, Accordion, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { STextFieldReadOnly } from './defaults';
import { useWeb3React } from '@web3-react/core';
import { useNFTContract } from '../lib/ContractConnector';
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
  const { contract, signContract, handleTx, handleTxError } = useNFTContract();

  const [baseURIInput, setBaseURIInput] = useState('');
  const [whitelist, setWhitelist] = useState('');
  const [whitelistSig, setWhitelistSig] = useState('');
  const [diamondlist, setDiamondlist] = useState('');
  const [diamondlistSig, setDiamondlistSig] = useState('');

  const [{ name, symbol, baseURI, balance }, setContractInfo] = useState(initialContractInfo);

  const { address, owner, publicSaleActive, whitelistActive, diamondlistActive, totalSupply, updateMintState } =
    useMintState();

  const isContractOwner =
    // true || //
    account && owner && account.toLowerCase() === owner.toLowerCase();

  const signer = library?.getSigner();

  const updateAdminInfo = async () => {
    const name = await contract.name();
    const symbol = await contract.symbol();
    const baseURI = await contract.baseURI();
    const balance = await contract?.provider.getBalance(contract.address);

    setContractInfo({
      name: name,
      symbol: symbol,
      baseURI: baseURI,
      balance: balance,
    });
  };

  useEffect(() => {
    if (isContractOwner) updateAdminInfo();
  }, [account]);

  if (!isContractOwner) return null;

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
                      signContract.setBaseURI(baseURIInput).then(updateAdminInfo).then(handleTx).catch(handleTxError)
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
export default AdminPanel;