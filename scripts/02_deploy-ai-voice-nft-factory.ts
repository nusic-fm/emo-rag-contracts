import { ethers, network } from "hardhat";
import { AIVoiceNFTFactory, AIVoiceNFTFactory__factory } from "../typechain-types";
async function main() {

  const [owner, addr1] = await ethers.getSigners();
  console.log("Network = ",network.name);
  console.log("Owner address = ",owner.address);
  
  const AIVoiceNFTFactory:AIVoiceNFTFactory__factory = await ethers.getContractFactory("AIVoiceNFTFactory");
  const aiVoiceNFTFactory:AIVoiceNFTFactory = await AIVoiceNFTFactory.deploy(owner.address);
  await aiVoiceNFTFactory.deployed();
  console.log("AIVoiceNFTFactory deployed to: ", aiVoiceNFTFactory.address);

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
