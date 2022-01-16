import { useState } from "react";
import { useContract, useSigner } from "wagmi";
import { AssetFinder } from "../components/asset-finder";
import { Asset, AssetList, AssetType } from "../components/assets";
import { Button } from "../components/button";
import { nftBagsABI } from '../abis/NFTBags'
import { Contract } from "ethers";
import { getContractAddresses } from "../contracts";
import { Container } from "../components/container";

export function DashboardPage() {
    const [assets, setAssets] = useState<(Asset)[]>([])
    const [{ data: signer, error, loading }, getSigner] = useSigner({
        skip: true
    })

    // const nftBags = useContract({
    //     addressOrName: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    //     contractInterface: nftBagsABI,
    //     signerOrProvider: signer
    // })

    const handle_onAssetFound = (asset: Asset) => {
        if (assets.find(x => x.address.toLowerCase() === asset.address.toLowerCase()))
            return
        setAssets([...assets, asset])
    }
    const handle_selectionChanged = () => {
        setAssets([...assets])// xD Sorry
    }

    const handle_mint = async () => {
        const tokens721 = assets.filter(x => x.type == AssetType.ERC721)
        const addresses721 = tokens721.map(x => x.address)
        const chainId = await signer?.getChainId()
        if (!chainId) return
        //const signer = await getSigner()
        const nftBags = new Contract(getContractAddresses(chainId).nftBags, nftBagsABI, signer)

        try {
            console.log('minting', addresses721)
            const tx = await nftBags.mint(
                addresses721, [0], //712
                [], [], [] // 1155
            , )
            console.log('tx', tx)
        } catch (e) {
            console.error(e)
        }
    }

    const selectedAssets = assets.filter(x => x.selected)
    return (
        <section>
            <h1>
                Mint
            </h1>
            <Container color="#2a4272">
                <AssetFinder onAssetFound={handle_onAssetFound} />
                <AssetList assets={assets} selectionChanged={handle_selectionChanged} />
            </Container>
            <div>
                <Button onClick={handle_mint} disabled={!selectedAssets || selectedAssets.length == 0}>Mint with {selectedAssets.length} assets</Button>
            </div>
        </section>
    )
}