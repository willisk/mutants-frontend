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
  NFTAddress: '0xeF1c8Fdfc6a83aDCb64Bc48ddc983A3f05DE1Da3',
  MutantsAddress: '0x52C0E6436eCdCd37F8835C81e22101a7d1Aed5aD',
  SerumAddress: '0xFdc4266c9B3787A5a8881E283b904B2A7DB9cc7e',
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
