import { useSerumContract } from '../useContract';
import { useContractState } from '../useContractState';

const key = 'SerumAdminState';

const initialState = {
  name: '',
  symbol: '',
  baseURI: '',
  balance: '0',
};

export default function useSerumAdminState() {
  const { contract } = useSerumContract();

  const fetchState = async () => ({
    baseURI: await contract.baseURI(),
    balance: await contract?.provider.getBalance(contract.address),
    randomSeedSet: await contract.randomSeedSet(),
    megaIdsSet: await contract.megaIdsSet(),
  });

  return useContractState({ key, fetchState, initialState });
}
