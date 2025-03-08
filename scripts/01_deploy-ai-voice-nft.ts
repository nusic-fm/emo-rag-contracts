import { ethers, network } from "hardhat";
import { AIVoiceNFT, AIVoiceNFT__factory } from "../typechain-types";
async function main() {

  const [owner, addr1] = await ethers.getSigners();
  console.log("Network = ",network.name);
  console.log("Owner address = ",owner.address);
  
  const AIVoiceNFT:AIVoiceNFT__factory = await ethers.getContractFactory("AIVoiceNFT");
  const aiVoiceNFT:AIVoiceNFT = await AIVoiceNFT.deploy(owner.address, "Trump","TrumpVoice","TRUMP", "url");
  await aiVoiceNFT.deployed();
  console.log("AIVoiceNFT deployed to: ", aiVoiceNFT.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
