import { useWeb3React } from '@web3-react/core';
import { useAccountState } from '..';
import { useNFTContract, useSerumContract } from '../useContract';

const key = 'SerumClaimState';

export default function useSerumClaimState() {
  const { account } = useWeb3React();
  const { contract: nftContract } = useNFTContract();
  const { contract: serumContract } = useSerumContract();

  const fetchState = async () => {
    const claimActive = await serumContract.claimActive();
    const tokenIds = await nftContract.tokenIdsOf(account);
    const claimed = await Promise.all(tokenIds.map((tokenId) => serumContract.claimed(tokenId)));

    const unclaimedIds = tokenIds.filter((tokenId, i) => !claimed[i]);

    // console.log('tokenIds', tokenIds);
    // console.log('unclaimedIds', unclaimedIds);

    return { claimActive, tokenIds, claimed, unclaimedIds };
  };

  return useAccountState({ key, fetchState });
}
