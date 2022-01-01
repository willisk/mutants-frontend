import { useMutantsContract } from '../useContract';
import { useContractState } from '../useContractState';

const key = 'MutantsAdminState';

const initialState = {
  baseURI: '',
  balance: '0',
};

export default function useMutantsAdminState() {
  const { contract } = useMutantsContract();

  const fetchState = async () => ({
    randomSeedSet: await contract.randomSeedSet(),
    revealed: await contract.revealed(),
    baseURI: await contract.baseURI(),
    balance: await contract?.provider.getBalance(contract.address),
  });

  return useContractState({ key, fetchState, initialState });
}
