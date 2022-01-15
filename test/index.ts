import { expect } from "chai";
import { ethers } from "hardhat";

describe("NFTBags", function () {
  it("should transfer NFTs from owner to contract when minting", async function () {
    const [deployer, owner_1, owner_2] = await ethers.getSigners()

    /**
     * NFTBags
     */
    const NFTBags = await ethers.getContractFactory("NFTBags")
    const nftBags = await NFTBags.deploy()
    await nftBags.deployed()


    /**
    * Setup demo NFTs
    */

    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy()



    await myToken.safeMint(owner_1.address)
    const tokenId721 = 0 // TODO: get from logs
    expect(await myToken.ownerOf(tokenId721)).to.eq(owner_1.address);
    await myToken.connect(owner_1).setApprovalForAll(nftBags.address, true)


    /**
     * MINT BAG
     */
    const mintTX = await nftBags.connect(owner_1).mint([myToken.address], [tokenId721], [], [], [])
    await mintTX.wait()
    const bagId = 0; // TODO: get from logs

    expect(await myToken.ownerOf(tokenId721)).to.eq(nftBags.address);


    /**
     * Transfer to owner 2 
     */
    await nftBags.connect(owner_1)["safeTransferFrom(address,address,uint256)"](owner_1.address, owner_2.address, bagId)
    expect(await nftBags.ownerOf(tokenId721)).to.eq(owner_2.address);

    // /**
    //  * Owner 2 burns it
    //  */
    const burnTX = await nftBags.connect(owner_2).burn(owner_2.address, owner_2.address, bagId)
    await burnTX.wait()
    expect(await myToken.ownerOf(tokenId721)).to.eq(owner_2.address);
  });

  it("Shold allow to transfer other bags", async function () {
    const [deployer, owner_1, owner_2] = await ethers.getSigners()

    /**
     * NFTBags
     */
    const NFTBags = await ethers.getContractFactory("NFTBags")
    const nftBags = await NFTBags.deploy()
    await nftBags.deployed()


    /**
    * Setup demo NFTs
    */

    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy()



    await myToken.safeMint(owner_1.address)
    const tokenId721 = 0 // TODO: get from logs
    expect(await myToken.ownerOf(tokenId721)).to.eq(owner_1.address);
    await myToken.connect(owner_1).setApprovalForAll(nftBags.address, true)


    /**
     * MINT BAG
     */
    const mintTX = await nftBags.connect(owner_1).mint([myToken.address], [tokenId721], [], [], [])
    await mintTX.wait()
    const bagId = 0; // TODO: get from logs

    expect(await myToken.ownerOf(tokenId721)).to.eq(nftBags.address);


    
  })
});
