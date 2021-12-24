import { ethers } from 'ethers';
const { abi: NFTAbi } = require('./abi/NFT.json');
const { abi: SerumAbi } = require('./abi/Serum.json');
const { abi: MutantsAbi } = require('./abi/Mutants.json');

export const nftContractConfig = {
  maxSupply: 1000,
  mintPrice: ethers.utils.parseEther('0.03'),
  purchaseLimit: 10,
};

// export const serumContractConfig = {
//   maxSupply: 100,
//   mintPrice: ethers.utils.parseEther('0.01'),
//   purchaseLimit: 10,
// };

export const config = {
  NFTAbi: NFTAbi,
  SerumAbi: SerumAbi,
  MutantsAbi: MutantsAbi,
  NFTAddress: '0xbd1FB312953544b5781601048f2088C4B02DDdDb',
  // MutantAddress: "0x779C7d959dab9F0A96652C5c018d193B9E08303B",
  // SerumAddress: "0x0c4497C76978E851Ae04Ccad0C2D4018606bB8D6",
  supportedChainIds: [80001],
};
