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
    const [error, setError] = useState<string>()
    const [{ }, getSigner] = useSigner({
        skip: true
    })

    // const nftBags = useContract({
    //     addressOrName: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    //     contractInterface: nftBagsABI,
    //     signerOrProvider: signer
    // })

    const handle_onAssetFound = (asset: Asset) => {
        if (asset.type == AssetType.ERC20) {
            if (assets.find(x => x.address.toLowerCase() === asset.address.toLowerCase()))
                return
        }
        if (asset.type == AssetType.ERC721) {
            const found = assets.filter(x => x.address.toLowerCase() === asset.address.toLowerCase())
            if (found.find(x => x.tokenId == asset.tokenId))
                return
        }
        // TODO: validate 1155
        setAssets([...assets, asset])
    }
    const handle_selectionChanged = () => {
        setAssets([...assets])// xD Sorry
    }

    const handle_mint = async () => {
        const tokens721 = assets.filter(x => x.type == AssetType.ERC721)
        const addresses721 = tokens721.map(x => x.address)
        const signer = await getSigner()
        const chainId = await signer?.getChainId()
        if (!chainId) return
        const nftBags = new Contract(getContractAddresses(chainId).nftBags, nftBagsABI, signer)

        try {
            console.log('minting', addresses721)
            const tx = await nftBags.mint(
                addresses721, [0], //712
                [], [], [] // 1155
            , )
            console.log('tx', tx)
        } catch (e: any) {
            const errorPrefix = 'reverted with reason string'
            const message = (e?.data?.message || e?.message) as (string | undefined)
            if (message) {
                const reverMessageIndex = message?.indexOf(errorPrefix)
                if (reverMessageIndex && reverMessageIndex >= 0) {
                    setError(message.substring(reverMessageIndex + errorPrefix.length))
                }
                else
                    setError(message)
            }
            else {
                setError(JSON.stringify(e))
            }
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
            {error && <Container color="#D22">
                <span style={{
                    fontSize: '14pt'
                }}>
                    {error}
                </span>
            </Container>}
            <div>
                <Button onClick={handle_mint} disabled={!selectedAssets || selectedAssets.length == 0}>Mint with {selectedAssets.length} assets</Button>
            </div>
        </section>
    )
}