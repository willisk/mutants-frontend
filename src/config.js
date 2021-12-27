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
  NFTAddress: '0x37783959966781eE419f7b038D357DF661778DEe',
  MutantsAddress: '0x9131CF0FD40c266d94C8446a29B73256C6d50F87',
  SerumAddress: '0x2524C7fE54976b6CA8C86D90D8a03912e4d9DeCB',
  supportedChainIds: [80001],
};

export const NFTContract = new ethers.Contract(config.NFTAddress, NFTAbi);
export const SerumContract = new ethers.Contract(config.SerumAddress, SerumAbi);
export const MutantsContract = new ethers.Contract(config.MutantsAddress, MutantsAbi);

// export const serumContractConfig = {
//   maxSupply: 100,
//   mintPrice: ethers.utils.parseEther('0.01'),
//   purchaseLimit: 10,
// };
