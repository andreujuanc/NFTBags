// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const [deployer, owner_1, owner_2] = await ethers.getSigners()

  const NFTBags = await ethers.getContractFactory("NFTBags")
  const nftBags = await NFTBags.deploy()
  await nftBags.deployed()

  // TOOD: if only hardhat/localhost
  // const tx2 = await deployer.sendTransaction({
  //   to: user,
  //   value: ethers.constants.WeiPerEther,
  // });
  // await tx2.wait();


  console.log('NFTBags', nftBags.address)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
