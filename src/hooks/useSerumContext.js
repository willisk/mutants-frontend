import { useWeb3React } from '@web3-react/core';
import { useSerumContract } from '../lib/ContractConnector';
import { useContractState } from './useContractState';

const key = 'SerumContext';

export function useSerumContext() {
  const { contract } = useSerumContract();
  const { account } = useWeb3React();

  const fetchState = async () => {
    const state = {
      owner: await contract.owner(),
      claimActive: await contract.claimActive(),
    };

    const isContractOwner =
      // true || //
      account && state.owner && account.toLowerCase() === state.owner.toLowerCase();

    return { ...state, isContractOwner };
  };

  return useContractState({ key, fetchState });
}
