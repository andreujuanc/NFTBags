import { Checkbox } from "../checkbox"
import './index.css'

export function AssetList({ assets, selectionChanged }: {
    assets: Asset[],
    selectionChanged: () => void
}) {

    return (<div>
        {assets.map(x => (
            <AssetItem key={`${x.address}-${x.tokenId}`} asset={x} selected={() => {
                selectionChanged()
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
            <div>{asset.tokenId}</div>
        </div>
    )
}

export type Asset = {
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