import { Fragment, useContext, useState } from 'react';
import { Box, Button, Typography, Tabs, Tab, Divider } from '@mui/material';
import { TransactionContext, UnsupportedChainIdBanner, useContractState } from '../lib/ContractConnector';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import { TwitterLogo, DiscordLogo, GithubLogo, PolygonLogo } from '../images/logos';
import { WalletConnectButton } from '../lib/WalletConnectButton';

// import { Home } from './_Main';
import { Mint } from './Mint/Mint';
import { Serum } from './Serum';
import { Mutants } from './Mutants';
import Confetti from 'react-confetti';
import { useParty } from '../hooks/useParty';
import useWindowSize from 'react-use/lib/useWindowSize';

function SocialsButton(props) {
  const Logo = props.logo;
  return (
    <Button variant="text" target="_blank" rel="noreferrer" style={{ minWidth: 20, marginInline: 10 }} {...props}>
      <Logo style={{ height: 18, width: 'auto' }} />
    </Button>
  );
}

const Socials = () => (
  <Fragment>
    <Box marginBlock="auto">
      <SocialsButton href="https://solana.com/" logo={PolygonLogo} />
    </Box>
    <Box marginBlock="auto">
      <SocialsButton href="" logo={GithubLogo} />
      <SocialsButton href="" logo={TwitterLogo} />
      <SocialsButton href="" logo={DiscordLogo} />
    </Box>
  </Fragment>
);

const ALL_ROUTES = ['/mint', '/serum', '/mutate'];
const DEFAULT_TAB = '/mint';

export function Home() {
  // console.log('running render Container');
  const [activeTab, setActiveTab] = useState(window.location?.pathname || DEFAULT_TAB);

  const highlightedTab = ALL_ROUTES.includes(activeTab) ? activeTab : DEFAULT_TAB;
  const { width, height } = useWindowSize();

  const { recycleConfetti, runConfetti } = useParty();

  return (
    <Fragment>
      <Confetti
        width={width}
        height={height}
        numberOfPieces={200}
        run={runConfetti}
        recycle={recycleConfetti}
        gravity={0.1}
      />
      <UnsupportedChainIdBanner />
      <BrowserRouter>
        <Box className="App" textAlign="center">
          <Box
            className="App-container"
            minHeight="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box>
              <Box className="header" display="flex" justifyContent="space-between" sx={{ boxShadow: 3 }}>
                <Box marginBlock="auto" marginInline="1em">
                  <Typography variant="h4">Mutants</Typography>
                </Box>
                <Box marginBlock="auto">
                  <Tabs value={highlightedTab} indicatorColor="primary" onChange={(event, tab) => setActiveTab(tab)}>
                    <Tab label="Mint" component={Link} value={'/mint'} to={'/mint'} />
                    <Tab label="" icon={<Divider orientation="vertical" />} disabled />
                    <Tab label="Serum" component={Link} value={'/serum'} to={'/serum'} />
                    <Tab label="" icon={<Divider orientation="vertical" />} disabled />
                    <Tab label="Mutants" component={Link} value={'/mutate'} to={'/mutate'} />
                  </Tabs>
                </Box>
                <WalletConnectButton />
              </Box>
              <Divider />
            </Box>

            <Box className="container" margin="auto" minHeight={400}>
              {/* <Box justifyItems="center" sx={{ p: 5 }}> */}
              <Routes>
                <Route path="/mint" element={<Mint />} />
                <Route path="/serum" element={<Serum />} />
                <Route path="/mutate" element={<Mutants />} />
                {/* <Route path="/mutate" element={<Mutants />} /> */}
                {/* <Route path="/my-nfts" element={<OpenTasks />} />
                <Route path="/task/:id" element={<DisplayTask />} />
                <Route path="/" exactly element={<renderFor404Routes />} /> */}
              </Routes>
              {/* </Box> */}
            </Box>

            <Box>
              <Divider />
              <Box className="footer" display="flex" justifyContent="space-between" height={32}>
                <Socials />
              </Box>
            </Box>
          </Box>
        </Box>
      </BrowserRouter>
    </Fragment>
  );
}
