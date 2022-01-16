import { ethers } from "hardhat";

import fetch from 'node-fetch'
async function main() {
    if (!process.env.ADDRESS) throw new Error('ADDRESS is not set')

    const MyToken = await ethers.getContractFactory("MyToken");
    // await MyToken.deploy()
    //console.log('MyToken', myToken.address)
  
    const user = process.env.ADDRESS

    // FOR SOME REASON THE TOKEN.ADDRESS IS WRONG.
    // https://github.com/nomiclabs/hardhat/issues/2162
    const rpcIsPotato = '0xb91f537cd4e5f5dc3965fc8c8b20a6ef4a39e510'
    const myToken = MyToken.attach(rpcIsPotato)
    await myToken.safeMint(user)
    await myToken.safeMint(user)
    // const response =await fetch(`https://deep-index.moralis.io/api/v2/nft/${rpcIsPotato}/sync?chain=mumbai`, {
    //     "headers": {
    //         "Accept": "*/*",
    //         "X-API-Key": process.env.MORALIS_API_KEY ?? ''
    //     },
    //     "method": "PUT",
    // });
    // console.log('SYNC', await response.text())
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
