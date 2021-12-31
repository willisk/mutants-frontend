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
  NFTAddress: '0xd933ea64aC85D0f6D14B8FB484a7205B0B9C4834',
  MutantsAddress: '0x6CdaC7439cDCda1b87DC803f3D36A6C21BA9BEe1',
  SerumAddress: '0x8d237eca8B3D1548434f3CF863E06c98fB7d306c',
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
