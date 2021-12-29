import { ethers } from 'ethers';
const { abi: NFTAbi } = require('./abi/NFT.json');
const { abi: SerumAbi } = require('./abi/Serum.json');
const { abi: MutantsAbi } = require('./abi/Mutants.json');

export const nftContractConfig = {
  maxSupply: 1000,
  mintPrice: ethers.utils.parseEther('0.03'),
  purchaseLimit: 10,
  mintPriceWL: ethers.utils.parseEther('0.03'),
  purchaseLimitWL: 2,
};

export const mutantsContractConfig = {
  maxSupply: 1000,
  mintPrice: ethers.utils.parseEther('0.03'),
  purchaseLimit: 10,
};

export const config = {
  NFTAddress: '0x91531d2e2840012e418De8e1c539439a7Bc12231',
  MutantsAddress: '0x5336a4c464CAAdB42ac5c8Af63F5ce802Aa21eA7',
  SerumAddress: '0x32341e3504aB6a8CEB453080C0A9ea21B837be3e',
  supportedChainIds: [80001],
  validChainName: 'Mumbai',
};

export const NFTContract = new ethers.Contract(config.NFTAddress, NFTAbi);
export const SerumContract = new ethers.Contract(config.SerumAddress, SerumAbi);
export const MutantsContract = new ethers.Contract(config.MutantsAddress, MutantsAbi);

// export const serumContractConfig = {
//   maxSupply: 100,
//   mintPrice: ethers.utils.parseEther('0.01'),
//   purchaseLimit: 10,
// };
