import { ethers, network } from "hardhat";
import { RegisterAIVoiceAsset, RegisterAIVoiceAsset__factory } from "../typechain-types";
const addresses = require("./address.json");

async function main() {

  const [owner, addr1] = await ethers.getSigners();
  console.log("Network = ",network.name);

  const RegisterAIVoiceAsset:RegisterAIVoiceAsset__factory = await ethers.getContractFactory("RegisterAIVoiceAsset");
  const registerAIVoiceAsset:RegisterAIVoiceAsset = await RegisterAIVoiceAsset.attach(addresses[network.name].registerAIVoiceAsset);

  console.log("RegisterAIVoiceAsset Address:", registerAIVoiceAsset.address);

  const txt1 = await registerAIVoiceAsset.mintAndRegisterAndCreateTermsAndAttach(owner.address,"url","0x9dD5381aBf7CB8eBFF17cE7C15217c5aa6DFFF03", "Happy", "Proud", "Successful");
  console.log("txt1.hash = ",txt1.hash);
  const receipt = await txt1.wait();
  console.log("receipt done");

  const filter = registerAIVoiceAsset.filters.MintAndRegisterAndCreateTermsAndAttach();
  const events = await registerAIVoiceAsset.queryFilter(filter);
  console.log("events = ",events);
  events.forEach((event) => {
    console.log("event.args = ",event.args);
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
