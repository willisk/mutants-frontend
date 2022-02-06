const chains = {
  1: 'Ethereum Mainnet',
  3: 'Ropsten Testnet',
  4: 'Rinkeby Testnet',
  42: 'Kovan Testnet',
  56: 'Binance Smartchain',
  137: 'Polygon Network',
  43114: 'AVAX Network',
  80001: 'Mumbai Testnet',
};

export const getNetworkName = (chain) => chains[chain] || 'Unknown Network';

const blockExplorerURLs = {
  1: 'https://etherscan.io/',
  3: 'https://ropsten.etherscan.io/',
  4: 'https://rinkeby.etherscan.io/',
  42: 'https://kovan.etherscan.io/',
  137: 'https://polygonscan.com/',
  80001: 'https://mumbai.polygonscan.com/',
  43113: 'https://testnet.snowtrace.io/',
};

export const getBlockExplorerUrl = (chainId) => {
  return blockExplorerURLs[chainId] ?? 'https://etherscan.io/';
};

export const getTransactionLink = (txHash, chainId) => {
  return getBlockExplorerUrl(chainId) + 'tx/' + txHash;
};

export const getAddressLink = (address, chainId) => {
  return getBlockExplorerUrl(chainId) + 'address/' + address;
};
