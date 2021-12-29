import { createContext, useContext, useEffect, useState } from 'react';
import Confetti from 'react-confetti';

const ConfettiContext = createContext();

export function useParty() {
  return useContext(ConfettiContext);
}

export function ConfettiProvider({ children }) {
  const [recycle, setRecycle] = useState(false);
  const [run, setRun] = useState(false);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const update = () => {
    setWidth(document.body.scrollWidth);
    setHeight(document.body.scrollHeight);
  };

  const startParty = () => {
    update();
    setRun(true);
    setRecycle(true);
    setTimeout(() => setRecycle(false), 800);
    setTimeout(() => setRun(false), 8000);
  };

  window.startParty = startParty;

  useEffect(() => {
    // body doesn't provide resize events
    window.addEventListener('resize', update);
  }, []);

  return (
    <ConfettiContext.Provider value={startParty}>
      <Confetti width={width} height={height} numberOfPieces={200} run={run} recycle={recycle} gravity={0.1} />
      {children}
    </ConfettiContext.Provider>
  );
}
