import { atom, useRecoilState } from 'recoil';
import { useCallback } from 'react';

const partyState = atom({
  key: 'PartyState',
  default: { recycleConfetti: false, runConfetti: false },
});

export function useParty() {
  const [{ recycleConfetti, runConfetti }, setState] = useRecoilState(partyState);

  const startParty = useCallback(() => {
    setState({ recycleConfetti: true, runConfetti: true });
    setTimeout(() => setState({ recycleConfetti: false, runConfetti: true }), 800);
    setTimeout(() => setState({ recycleConfetti: false, runConfetti: false }), 8000);
  }, [setState]);

  window.startParty = startParty;

  return { recycleConfetti, runConfetti, startParty };
}
