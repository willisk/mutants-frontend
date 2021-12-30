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
  // NFTAddress: '0x46623964150429B8317FbDF07F982F472C659E47',
  // MutantsAddress: '0x912e32391eAF5b93F80FF1E957c52C911cFa4DC5',
  // SerumAddress: '0x466fbbb0f58368596bc7B138AEBdAD6c5B6012f2',
  NFTAddress: '0x8a9Dd644938471870fe1E6dFdDE6B75375A143cE',
  MutantsAddress: '0x34330bE0c7e99759FbBb665d5a66e8f386803827',
  SerumAddress: '0x5970e1a60e2134760aeF3a28EE2d9F824785F60d',
  supportedChainIds: [4, 80001],
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
