import { useNFTContract } from '../useTx';
import { useContractState } from '../useContractState';

const key = 'MintAdminState';

const initialState = {
  name: '',
  symbol: '',
  baseURI: '',
  balance: '0',
};

export function useMintAdminState() {
  const { contract } = useNFTContract();

  const fetchState = async () => ({
    name: await contract.name(),
    symbol: await contract.symbol(),
    baseURI: await contract.baseURI(),
    balance: await contract?.provider.getBalance(contract.address),
  });

  return useContractState({ key, fetchState, initialState });
}
