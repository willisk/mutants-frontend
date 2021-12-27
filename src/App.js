import './App.css';
import { Box, Button, CssBaseline, Typography, Tabs, Tab, Divider } from '@mui/material';
import { Fragment, useState } from 'react';
import { ThemeProvider, createTheme, themeOptions } from '@mui/material/styles';

import { ContractInterfaceProvider, UnsupportedChainIdBanner } from './lib/ContractConnector';
import { Home } from './components/Home';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  // library.pollingInterval = 12000;
  return library;
}

const theme = createTheme({
  palette: {
    // mode: 'light',
    mode: 'dark',
    primary: {
      main: '#c6ff00',
      // main: '#5d175e',
    },
    secondary: {
      // main: '#5d175e',
      main: '#e040fb',
    },
    divider: 'gray',
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3ReactProvider getLibrary={getLibrary}>
        <ContractInterfaceProvider>
          <Home />
        </ContractInterfaceProvider>
      </Web3ReactProvider>
    </ThemeProvider>
  );
}

export default App;
