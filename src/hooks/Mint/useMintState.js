import { useWeb3React } from '@web3-react/core';
import { useNFTContract } from '../lib/ContractConnector';
import { useContractState } from './useContractState';

const key = 'MintState';

export function useMintState() {
  const { contract } = useNFTContract();
  const { account } = useWeb3React();

  const fetchState = async () => {
    const state = {
      owner: await contract.owner(),
      name: await contract.name(),
      symbol: await contract.symbol(),
      publicSaleActive: await contract.publicSaleActive(),
      whitelistActive: await contract.whitelistActive(),
      diamondlistActive: await contract.diamondlistActive(),
      totalSupply: await contract.totalSupply(),
    };

    const isContractOwner =
      // true || //
      account && state.owner && account.toLowerCase() === state.owner.toLowerCase();

    return { ...state, isContractOwner };
  };

  const initializer = () => contract.on(contract.filters.PublicSaleStateUpdate(), fetchState);

  return useContractState({ key, fetchState, initializer });
}
