import { ethers } from 'ethers';
const { abi: NFTAbi } = require('./abi/NFT.json');
const { abi: SerumAbi } = require('./abi/Serum.json');
const { abi: MutantsAbi } = require('./abi/Mutants.json');

export const nftContractConfig = {
  maxSupply: 10000,
  mintPrice: ethers.utils.parseEther('0.03'),
  purchaseLimit: 3,
  mintPriceWL: ethers.utils.parseEther('0.02'),
  purchaseLimitWL: 2,
};

export const mutantsContractConfig = {
  maxSupply: 10000,
  mintPrice: ethers.utils.parseEther('0.03'),
  purchaseLimit: 10,
};

export const config = {
  NFTAddress: '0x98c97b8ddF087908f5019467436cE9E48670ba8c',
  MutantsAddress: '0xAfBb1cB037DEd5E80FF21A89FDe45E675ebfC829',
  SerumAddress: '0x0E5C9Efdd996260F87f9EF0713F2E0beA6C0F962',
  supportedChainIds: [4],
  validChainName: 'Rinkeby',
};

export const NFTContract = new ethers.Contract(config.NFTAddress, NFTAbi);
export const SerumContract = new ethers.Contract(config.SerumAddress, SerumAbi);
export const MutantsContract = new ethers.Contract(config.MutantsAddress, MutantsAbi);

// export const serumContractConfig = {
//   maxSupply: 100,
//   mintPrice: ethers.utils.parseEther('0.01'),
//   purchaseLimit: 10,
// };
