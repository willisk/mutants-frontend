import { useMutantsContract } from '../lib/ContractConnector';
import { useContractState } from './useContractState';

const key = 'MutantsAdminState';

const initialState = {
  baseURI: '',
  balance: '0',
};

export function useMutantsAdminContext() {
  const { contract } = useMutantsContract();

  const fetchState = async () => ({
    randomSeedSet: await contract.randomSeedSet(),
    baseURI: await contract.baseURI(),
    balance: await contract?.provider.getBalance(contract.address),
  });

  return useContractState({ key, fetchState, initialState });
}
