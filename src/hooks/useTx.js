import { createContext, useState, useContext, Fragment, useCallback } from 'react';
import { Snackbar, Link } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import { useWeb3React } from '@web3-react/core';

import { getTransactionLink } from '../lib/ChainIds';

export const TransactionContext = createContext({});

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

export function TransactionContextProvider({ children }) {
  const [isSendingTx, setIsSendingTx] = useState(false);

  const [alertState, setAlertState] = useState({
    open: false,
    message: '',
    severity: undefined,
  });

  const { account, chainId } = useWeb3React();

  window.web3r = useWeb3React();

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

  const handleTx = useCallback(
    async (tx) => {
      setIsSendingTx(true);
      alert(<TransactionLink txHash={tx.hash} message="Processing Transaction" chainId={chainId} />, 'info');
      const receipt = await tx.wait();
      alert(
        <TransactionLink txHash={receipt.transactionHash} message="Transaction successful!" chainId={chainId} />,
        'success'
      );
      setIsSendingTx(false);
      return receipt;
    },
    [chainId]
  );

  const context = {
    handleTx: handleTx,
    handleTxError: handleTxError,
    isSendingTx: isSendingTx,
  };

  return (
    <TransactionContext.Provider value={context}>
      <Fragment>{children}</Fragment>
      <Snackbar open={alertState.open} autoHideDuration={3000} onClose={handleAlertClose}>
        <MuiAlert onClose={handleAlertClose} severity={alertState.severity}>
          {alertState.message}
        </MuiAlert>
      </Snackbar>
    </TransactionContext.Provider>
  );
}

export function useTx() {
  return useContext(TransactionContext);
}

// export { useUserState } from './userState';
// export { useContractState } from './contractState';
