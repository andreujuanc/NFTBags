import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { findUserAssetsWithMoralis, MoralisToken } from "../../lib/moralis"
import { Checkbox } from "../checkbox"
import './index.css'
//import Moralis from 'moralis'

export function AssetList({ assets, selectionChanged }: {
    assets: Asset[],
    selectionChanged: (asset: Asset) => void
}) {
    const [{ data: accountData }] = useAccount()
    const [moralisAssets, setMoralisAssets] = useState<Asset[]>([])

    useEffect(() => {
        if (!accountData) return
        findUserAssetsWithMoralis(accountData.address)
            .then((result) => {

                setMoralisAssets(result.filter(x => !assets.find(b => x.id == b.id)))
            })
    }, [accountData?.address])

    return (<div>
        {assets.concat(moralisAssets.filter(x=>!assets.find(b => x.id == b.id))).sort((a, b) => a.id < b.id ? -1 : 1).map(x => (
            <AssetItem key={`${x.address}-${x.tokenId}`} asset={x} selected={() => {
                selectionChanged(x)
            }} />
        ))}
    </div>)
}

export function AssetItem({ asset, selected }: { asset: Asset, selected: (selected: boolean) => void }) {
    return (
        <div className="asset-item">
            <Checkbox onChange={(checked) => {
                asset.selected = checked
                selected(checked)
            }} />

            <div>{AssetType[asset.type]}</div>
            <div>{asset.name}</div>
            <div>{asset.tokenId && asset.tokenId.length > 10 ? asset.tokenId?.toString().substring(0, 4) + '...' + asset.tokenId?.toString().substring(asset.tokenId?.toString().length - 4) : asset.tokenId}</div>
            {/* <div>
                {asset.id}
            </div> */}
        </div>
    )
}

export type Asset = {
    id: string
    name: string
    symbol: string
    address: string
    type: AssetType
    tokenId?: string
    selected?: boolean
    balance?: string
}

export enum AssetType {
    ERC20,
    ERC721,
    ERC1155
}