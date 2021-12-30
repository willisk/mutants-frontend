import { useWeb3React } from '@web3-react/core';
import { useAccountState } from '..';
import { useSerumContract } from '../useContract';

const key = 'SerumState';

export default function useSerumState() {
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

  return useAccountState({ key, fetchState });
}
