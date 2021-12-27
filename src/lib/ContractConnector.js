import { createContext, useMemo, useEffect, useState, useContext, Fragment, useCallback } from 'react';
import { Snackbar, Button, Link } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import { useWeb3React } from '@web3-react/core';

import { Box } from '@mui/system';
import { getTransactionLink } from './ChainIds';
import { ethers } from 'ethers';

// import { config } from '../config';
import { MutantsContract, NFTContract, SerumContract } from '../config';

// const { NFTAbi, NFTAddress, } = config;

export const ContractContext = createContext({});

export const TransactionLink = ({ txHash, message, chainId }) => {
  return (
    <Link href={getTransactionLink(txHash, chainId)} target="_blank" rel="noreferrer">
      {message}
    </Link>
  );
};

const parseTxError = (e) => {
  console.error('error', e);
  try {
    return JSON.parse(/\(error=(.+), method.+\)/g.exec(e.message)[1]).message;
  } catch (error) {
    return e?.data?.message || e?.message || e;
  }
};

export function ContractInterfaceProvider({ children }) {
  const [isSendingTx, setIsSendingTx] = useState(false);

  const [alertState, setAlertState] = useState({
    open: false,
    message: '',
    severity: undefined,
  });

  // const [contractState, setContractState] = useState(null);
  // const [userState, setUserState] = useState(null);

  const { account, library, chainId } = useWeb3React();

  window.web3r = useWeb3React();

  // const updateMintState = async () => {
  //   getContractState(contract).then(setContractState);
  // };

  // const updateUserState = async () => {
  //   getUserState(contract, account).then(setUserState);
  // };

  // useEffect(() => {
  //   if (library?.provider) {
  //     contract.on(contract.filters.PublicSaleStateUpdate(), updateMintState);
  //     updateMintState();
  //   }
  // }, [chainId]); // XXX: should find better trigger and clean up event listener

  // ------- handle transactions --------

  const handleAlertClose = (event, reason) => {
    if (reason !== 'clickaway') setAlertState({ ...alertState, open: false });
  };

  const alert = (msg, severity) => {
    setAlertState({
      open: true,
      message: msg,
      severity: severity || 'error',
    });
  };

  const handleTxError = useCallback(
    (error) => {
      console.error(error);
      setIsSendingTx(false);
      if (error.reason === 'sending a transaction requires a signer') {
        if (!account) alert('Please connect your wallet');
        else alert('Please switch to a valid network');
      } else {
        alert(parseTxError(error));
      }
    },
    [account]
  );

  const handleTx = useCallback(async (tx) => {
    setIsSendingTx(true);
    alert(<TransactionLink txHash={tx.hash} message="Processing Transaction" chainId={chainId} />, 'info');
    const receipt = await tx.wait();
    alert(
      <TransactionLink txHash={receipt.transactionHash} message="Transaction successful!" chainId={chainId} />,
      'success'
    );
    setIsSendingTx(false);
    return receipt;
  }, []);

  const context = {
    handleTx: handleTx,
    handleTxError: handleTxError,
    isSendingTx: isSendingTx,
  };

  return (
    <ContractContext.Provider value={context}>
      <Fragment>{children}</Fragment>
      <Snackbar open={alertState.open} autoHideDuration={3000} onClose={handleAlertClose}>
        <MuiAlert onClose={handleAlertClose} severity={alertState.severity}>
          {alertState.message}
        </MuiAlert>
      </Snackbar>
    </ContractContext.Provider>
  );
}

export function useContractContext() {
  return useContext(ContractContext);
}

export function useTx() {
  const { handleTx, handleTxError, isSendingTx } = useContractContext();
  return { handleTx, handleTxError, isSendingTx };
}

export function useNFTContract() {
  const { handleTx, handleTxError } = useContractContext();
  const { account, library } = useWeb3React();

  const contract = useMemo(() => NFTContract.connect(library), [library?.provider]);
  const signContract = useMemo(() => NFTContract.connect(library?.getSigner()), [account]);

  window.nft = signContract;

  return { contract, signContract, handleTx, handleTxError };
}

export function useSerumContract() {
  const { handleTx, handleTxError } = useContractContext();
  const { account, library } = useWeb3React();

  const contract = useMemo(() => SerumContract.connect(library), [library?.provider]);
  const signContract = useMemo(() => SerumContract.connect(library?.getSigner()), [account]);

  window.serum = signContract;

  return { contract, signContract, handleTx, handleTxError };
}

export function useMutantsContract() {
  const { handleTx, handleTxError } = useContractContext();
  const { account, library } = useWeb3React();

  const contract = useMemo(() => MutantsContract.connect(library), [library?.provider]);
  const signContract = useMemo(() => MutantsContract.connect(library?.getSigner()), [account]);

  window.mutants = signContract;

  return { contract, signContract, handleTx, handleTxError };
}

export function UnsupportedChainIdBanner() {
  const { error, chainId } = useWeb3React();

  // console.log('chainId', chainId);

  if (error?.name === 'UnsupportedChainIdError')
    return (
      <Box className="invalid-network-banner" sx={{ background: 'orange', color: 'black' }}>
        Warning: Unsupported chain id. Please switch to the Polygon network.
      </Box>
    );
  return null;
}

// export { useUserState } from './userState';
// export { useContractState } from './contractState';
