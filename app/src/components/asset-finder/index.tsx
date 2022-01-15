import { BaseProvider, getDefaultProvider, JsonRpcProvider } from "@ethersproject/providers";
import { Contract } from "ethers";
import { useState } from "react";
import { erc20ABI, useProvider, erc721ABI, erc1155ABI, useConnect } from "wagmi";
import { Asset, AssetType } from "../assets";
import { Button } from "../button";
import { Input } from "../input";

export function AssetFinder({ onAssetFound }: { onAssetFound: (asset: Asset) => void }) {
    const [asset, setAsset] = useState<Asset | undefined>(undefined)
    //const provider = useProvider()
    const [{ data, error, loading, }, connect] = useConnect()
    
    const handle_onChange = async (value: string) => {
        const provider = new JsonRpcProvider('http://localhost:8545', {
            name: 'hardhat',
            chainId: await data.connector?.getChainId() ?? 0
        })
        if(!value) {
            setAsset(undefined)
            return
        }
        const found = await tryGetContract(value, provider)
        if (found) {
            setAsset(found)
        }
        else {
            setAsset(undefined)
        }
    }
    const handle_addClicked = () => {
        if (asset)
            onAssetFound(asset)
    }
    
    return (
        <div>
            <Input onChange={handle_onChange} />
            <Button onClick={handle_addClicked} disabled={!asset}>
                Add
            </Button>
        </div>
    )
}

async function tryGetContract(address: string, provider: BaseProvider): Promise<Asset | undefined> {
    //console.log('tryGetContract', provider?.network?.chainId)
    try {
        const erc20 = new Contract(address, erc20ABI, provider)
        return {
            address: address,
            name: await erc20.functions.name(),
            symbol: '',
            type: AssetType.ERC20,
            selected: true
        }
    }
    catch { }
    try {
        const erc721 = new Contract(address, erc721ABI, provider)
        return {
            address: address,
            name: await erc721.functions.name(),
            symbol: '',
            type: AssetType.ERC20,
            selected: true
        }
    }
    catch { }
    try {
        const erc1155 = new Contract(address, erc1155ABI, provider)
        return {
            address: address,
            name: await erc1155.functions.name(),
            symbol: '',
            type: AssetType.ERC20,
            selected: true
        }
    }
    catch { }
}
