import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';

import { MutantsContract, NFTContract, SerumContract } from '../config';

export function useNFTContract() {
  const { handleTx, handleTxError } = useTx();
  const { account, library } = useWeb3React();

  const contract = useMemo(() => NFTContract.connect(library), [library?.provider]);
  const signContract = useMemo(() => NFTContract.connect(library?.getSigner()), [account]);

  window.nft = signContract;

  return { contract, signContract, handleTx, handleTxError };
}

export function useSerumContract() {
  const { handleTx, handleTxError } = useTx();
  const { account, library } = useWeb3React();

  const contract = useMemo(() => SerumContract.connect(library), [library?.provider]);
  const signContract = useMemo(() => SerumContract.connect(library?.getSigner()), [account]);

  window.serum = signContract;

  return { contract, signContract, handleTx, handleTxError };
}

export function useMutantsContract() {
  const { handleTx, handleTxError } = useTx();
  const { account, library } = useWeb3React();

  const contract = useMemo(() => MutantsContract.connect(library), [library?.provider]);
  const signContract = useMemo(() => MutantsContract.connect(library?.getSigner()), [account]);

  window.mutants = signContract;

  return { contract, signContract, handleTx, handleTxError };
}
