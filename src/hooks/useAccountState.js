import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { atomFamily, useRecoilState } from 'recoil';

const accountState = atomFamily({
  key: 'AccountState',
  default: {},
});

var accountStateInitialized = {};
var accountStateLoading = {};

export function useAccountState({ key, fetchState, initialState, initializer }) {
  const [state, setState] = useRecoilState(accountState(key));
  const [componentDidMount, setComponentDidMount] = useState(false);

  const { account, library } = useWeb3React();

  const provider = library?.provider;

  const updateState = () => {
    fetchState()
      .then(setState)
      .then(() => {
        accountStateInitialized[key] = true;
        accountStateLoading[key] = false;
      });
  };

  useEffect(() => {
    // ensures that this will only be called once on init
    // or per provider update (if component has mounted already)
    // doesn't re-trigger when a component re-mounts
    if (
      account !== undefined &&
      provider !== undefined &&
      !accountStateLoading[key] &&
      (componentDidMount || !accountStateInitialized[key])
    ) {
      // console.log('running expensive fetch:', key);
      accountStateLoading[key] = true;
      if (initializer !== undefined) initializer(); // should be called once every "update"?
      updateState();
      setComponentDidMount(true);
    }
  }, [account]);

  if (!accountStateInitialized[key] && initialState !== undefined) return [initialState, updateState];

  return [state, updateState];
}
