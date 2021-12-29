import { useTx } from './ContractConnector';

const INITIAL_USER_STATE = {
  balance: undefined,
  items: undefined,
};

export const getUserState = async (contract, account) => {
  if (!contract.provider || account) return INITIAL_USER_STATE;
  console.log('fetching user state');
  const balance = await contract.balanceOf(account);
  const items = await Promise.all(
    [...Array(balance.toNumber())].map(async (_, i) => await contract.tokenOfOwnerByIndex(account, i))
  );

  return {
    balance: balance,
    items: items,
  };
};

export function useUserState() {
  const { userState, updateUserState } = useTx();
  return { ...userState, updateUserState };
}
