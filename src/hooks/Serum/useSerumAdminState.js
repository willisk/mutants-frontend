import { useSerumContract } from '../useContract';
import { useContractState } from '../useContractState';

const key = 'SerumAdminState';

const initialState = {
  name: '',
  symbol: '',
  baseURI: '',
};

export default function useSerumAdminState() {
  const { contract } = useSerumContract();

  const fetchState = async () => ({
    baseURI: await contract.baseURI(),
    randomSeedSet: await contract.randomSeedSet(),
    megaIdsSet: await contract.megaIdsSet(),
  });

  return useContractState({ key, fetchState, initialState });
}
