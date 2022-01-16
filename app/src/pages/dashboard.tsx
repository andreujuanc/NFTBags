import { useState } from "react";
import { erc721ABI, useContract, useSigner } from "wagmi";
import { AssetFinder } from "../components/asset-finder";
import { Asset, AssetList, AssetType } from "../components/assets";
import { Button } from "../components/button";
import { nftBagsABI } from '../abis/NFTBags'
import { Contract } from "ethers";
import { getContractAddresses } from "../contracts";
import { Container } from "../components/container";
import { ERC721ABI } from "../abis/ERC721";

export function DashboardPage() {
    const [assets, setAssets] = useState<(Asset)[]>([])
    const [approvedAssets, setApprovedAssets] = useState<string[]>([])
    const [error, setError] = useState<string>()
    const [{ }, getSigner] = useSigner({
        skip: true
    })

    const nextToApprove = assets.find(asset => {
        if (approvedAssets.find(approved => approved == asset.id)) return false
        return true
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

    const handle_selectionChanged = (asset: Asset) => {
        const index = assets.findIndex(x => x.id == asset.id) 
        if (index>= 0) {
            if(!asset.selected){
                assets.splice(index)
            }
            setAssets([...assets])
        }
        else {
            setAssets([...assets, asset])
        }
    }

    const handle_approve = async () => {
        setError(undefined)
        //TODO: check with isApprovedForAll
        try {


            if (nextToApprove) {
                const signer = await getSigner()
                if (!signer) return
                const chainId = await signer?.getChainId()
                if (!chainId) return
                const nftBagsContractAddress = getContractAddresses(chainId).nftBags

                if (nextToApprove.type == AssetType.ERC721) {

                    const contract721 = new Contract(nextToApprove.address, ERC721ABI, signer)
                    await contract721.functions.setApprovalForAll(nftBagsContractAddress, true)

                    setApprovedAssets([...approvedAssets, nextToApprove.id])
                }
            }

        } catch (e: any) {
            handleError(e);
        }
    }

    const handle_mint = async () => {
        setError(undefined)
        const tokens721 = assets.filter(x => x.type == AssetType.ERC721)
        const addresses721 = tokens721.map(x => x.address)
        const ids721 = tokens721.map(x => x.tokenId)

        const signer = await getSigner()
        const chainId = await signer?.getChainId()
        if (!chainId) return
        const nftBagsContractAddress = getContractAddresses(chainId).nftBags
        const nftBags = new Contract(nftBagsContractAddress, nftBagsABI, signer)

        try {
            console.log('minting', addresses721)
            const tx = await nftBags.mint(
                addresses721, ids721, //712
                [], [], [] // 1155
            , )
            console.log('tx', tx)
        } catch (e: any) {
            handleError(e);
        }
    }

    const selectedAssets = assets.filter(x => x.selected)
    console.log('SELECTED', selectedAssets)
    console.log('approved', approvedAssets)
    return (
        <section>
            <h1>
                Pack bag
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
                {nextToApprove && <Button onClick={handle_approve}>Approve {nextToApprove.name} {nextToApprove.tokenId}</Button>}
                {approvedAssets.length == selectedAssets.length && <Button onClick={handle_mint} disabled={!selectedAssets || selectedAssets.length == 0}>Pack bag with {selectedAssets.length} assets</Button>}
            </div>
        </section>
    )

    function handleError(e: any) {
        const errorPrefix = 'reverted with reason string';
        const message = (e?.data?.message || e?.message) as (string | undefined);
        if (message) {
            const reverMessageIndex = message?.indexOf(errorPrefix);
            if (reverMessageIndex && reverMessageIndex >= 0) {
                setError(message.substring(reverMessageIndex + errorPrefix.length));
            }

            else
                setError(message);
        }
        else {
            setError(JSON.stringify(e));
        }
    }
}