// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  if(!process.env.ADDRESS) throw new Error('ADDRESS is not set')
  if(!process.env.DEMO721)throw new Error('DEMO721 is not set')

  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.attach(process.env.DEMO721)

  
  const user = process.env.ADDRESS
  await myToken.safeMint(user)
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
