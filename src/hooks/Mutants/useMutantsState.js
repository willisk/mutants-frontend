import { useWeb3React } from '@web3-react/core';
import { useMutantsContract } from '../useContract';
import { useContractState } from '../useContractState';

const key = 'MutantsState';

export default function useMutantsState() {
  const { contract } = useMutantsContract();
  const { account } = useWeb3React();

  const fetchState = async () => {
    const state = {
      owner: await contract.owner(),
      publicSaleActive: await contract.publicSaleActive(),
      mutationsActive: await contract.mutationsActive(),
      numPublicMinted: await contract.numPublicMinted(),
    };

    const isContractOwner =
      // true || //
      account && state.owner && account.toLowerCase() === state.owner.toLowerCase();

    return { ...state, isContractOwner };
  };

  return useContractState({ key, fetchState });
}
