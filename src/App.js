import './App.css';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { RecoilRoot } from 'recoil';

import { TransactionContextProvider } from './hooks/useTx';
// import { TransactionContext, UnsupportedChainIdBanner } from './lib/ContractConnector';
import { Home } from './components/Home';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import { ConfettiProvider } from './hooks';

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  // library.pollingInterval = 12000;
  return library;
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#c6ff00',
    },
    secondary: {
      main: '#e040fb',
    },
    divider: 'gray',
  },
});

function App() {
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Web3ReactProvider getLibrary={getLibrary}>
          <TransactionContextProvider>
            <ConfettiProvider>
              <Home />
            </ConfettiProvider>
          </TransactionContextProvider>
        </Web3ReactProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default App;
