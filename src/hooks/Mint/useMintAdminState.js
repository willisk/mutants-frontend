import { useNFTContract } from '..';
import { useContractState } from '../useContractState';

const key = 'MintAdminState';

const initialState = {
  name: '',
  symbol: '',
  baseURI: '',
  balance: '0',
};

export default function useMintAdminState() {
  const { contract } = useNFTContract();

  const fetchState = async () => ({
    name: await contract.name(),
    symbol: await contract.symbol(),
    randomSeedSet: await contract.randomSeedSet(),
    baseURI: await contract.baseURI(),
    balance: await contract?.provider.getBalance(contract.address),
  });

  return useContractState({ key, fetchState, initialState });
}
