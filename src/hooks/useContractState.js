import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { atomFamily, useRecoilState } from 'recoil';

const contractState = atomFamily({
  key: 'ContractState',
  default: {},
});

var contractStateInitialized = {};
var contractStateLoading = {};

export function useContractState({ key, fetchState, initialState, initializer }) {
  const [state, setState] = useRecoilState(contractState(key));
  const [componentDidMount, setComponentDidMount] = useState(false);

  const { library } = useWeb3React();

  const provider = library?.provider;

  const updateState = () => {
    fetchState()
      .then(setState)
      .then(() => {
        contractStateInitialized[key] = true;
        contractStateLoading[key] = false;
      });
  };

  useEffect(() => {
    // ensures that this will only be called once on init
    // or per provider update (if component has mounted already)
    // doesn't re-trigger when a component re-mounts
    if (provider != undefined && !contractStateLoading[key] && (componentDidMount || !contractStateInitialized[key])) {
      // console.log('running expensive fetch:', key);
      contractStateLoading[key] = true;
      if (initializer != undefined) initializer(); // should be called once every "update"?
      updateState();
      setComponentDidMount(true);
    }
  }, [provider]);

  if (!contractStateInitialized[key] && initialState != undefined) return [initialState, updateState];

  return [state, updateState];
}
