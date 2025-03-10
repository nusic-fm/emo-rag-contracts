import { ethers, network } from "hardhat";
import { RegisterAIVoiceAsset, RegisterAIVoiceAsset__factory } from "../typechain-types";
const addresses = require("./address.json");

async function main() {

  const [owner, addr1] = await ethers.getSigners();
  console.log("Network = ",network.name);
  console.log("Owner address = ",owner.address);
  
  const RegisterAIVoiceAsset:RegisterAIVoiceAsset__factory = await ethers.getContractFactory("RegisterAIVoiceAsset");
  const registerAIVoiceAsset:RegisterAIVoiceAsset = await RegisterAIVoiceAsset.deploy(
    "0x77319B4031e6eF1250907aa00018B8B1c67a244b",
    "0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f",
    "0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316",
    "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E",
    "0x1514000000000000000000000000000000000000",
    //addresses[network.name].aiVoiceNFT
  );
  await registerAIVoiceAsset.deployed();
  console.log("RegisterAIVoiceAsset deployed to: ", registerAIVoiceAsset.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
