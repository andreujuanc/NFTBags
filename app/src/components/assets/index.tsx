import { Checkbox } from "../checkbox"

export function AssetList({ assets }: { assets: Asset[], selectionChanged: () => void }) {
    return (<div>
        {assets.map(x =>(
            <AssetItem key={x.address} asset={x} />
        ))}
    </div>)
}

export function AssetItem({ asset }: { asset: Asset }) {
    return (
        <div>
            <Checkbox onChange={(checked) => {
                asset.selected = checked
            }} />
            <span>{asset.name}</span>
        </div>
    )
}

export type Asset = {
    name: string
    symbol: string
    address: string
    type: AssetType
    selected?: boolean
}

export enum AssetType {
    ERC20,
    ERC721,
    ERC1155
}