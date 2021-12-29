import { useWeb3React } from '@web3-react/core';
import { useAccountState } from '../useAccountState';
import { useNFTContract, useSerumContract } from '../useContract';

const key = 'MutantsAccountState';

export default function useMutantsAccountState() {
  const { account } = useWeb3React();
  const { contract: nftContract } = useNFTContract();
  const { contract: serumContract } = useSerumContract();

  const fetchState = async () => {
    const tokenIds = await nftContract.tokenIdsOf(account);
    let serumIds = await serumContract.balanceOfBatch(Array(3).fill(account), [0, 1, 2]);

    serumIds = serumIds.map((i) => i.toNumber());

    return { tokenIds, serumIds };
  };

  return useAccountState({ key, fetchState });
}
