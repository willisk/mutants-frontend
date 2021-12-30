import { useWeb3React } from '@web3-react/core';
import { useAccountState, useNFTContract } from '..';

const key = 'MintState';

export default function useMintState() {
  const { contract } = useNFTContract();
  const { account } = useWeb3React();

  const fetchState = async () => {
    const owner = await contract.owner();
    const name = await contract.name();
    const symbol = await contract.symbol();
    const publicSaleActive = await contract.publicSaleActive();
    const whitelistActive = await contract.whitelistActive();
    const diamondlistActive = await contract.diamondlistActive();
    const totalSupply = await contract.totalSupply();

    const isContractOwner = account && owner && account.toLowerCase() === owner.toLowerCase();

    return { owner, name, symbol, publicSaleActive, whitelistActive, diamondlistActive, totalSupply, isContractOwner };
  };

  const initializer = () => contract.on(contract.filters.PublicSaleStateUpdate(), fetchState);

  // return useContractState({ key, fetchState, initializer });
  return useAccountState({ key, fetchState, initializer }); // useAccountState, because isContractOwner is account dependent
}
