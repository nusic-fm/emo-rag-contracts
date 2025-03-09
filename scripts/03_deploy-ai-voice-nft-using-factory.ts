import { ethers, network } from "hardhat";
import { AIVoiceNFTFactory, AIVoiceNFTFactory__factory } from "../typechain-types";
const addresses = require("./address.json");

async function main() {

  const [owner, addr1] = await ethers.getSigners();
  console.log("Network = ",network.name);
  console.log("Owner address = ",owner.address);
  
  const AIVoiceNFTFactory:AIVoiceNFTFactory__factory = await ethers.getContractFactory("AIVoiceNFTFactory");
  const aiVoiceNFTFactory:AIVoiceNFTFactory = await AIVoiceNFTFactory.attach(addresses[network.name].aiVoiceNFTFactory);

  console.log("AIVoiceNFTFactory Address: ", aiVoiceNFTFactory.address);

  //const tx = await aiVoiceNFTFactory.deployAIVoiceNFT(owner.address,"Trump","TrumpVoice","TRUMP", "url");
  const tx = await aiVoiceNFTFactory.deployAIVoiceNFT("0x429b697b0Bc1491F298C997140B62760ad2B0E17", "Adam","Adam","ADAM", "https://green-vicarious-wildcat-394.mypinata.cloud/ipfs/bafkreih52un25x5afl4mbxp3nxpnglatrjdzyoufg7szugwfmi66zf5lau");
  console.log("Transaction Hash: ", tx.hash);
  await tx.wait();
  console.log("AI Voice NFT deployed successfully");
 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
