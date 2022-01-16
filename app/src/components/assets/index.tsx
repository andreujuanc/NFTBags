import { Checkbox } from "../checkbox"
import './index.css'
//import Moralis from 'moralis'

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
            <div>
                {asset.id}
            </div>
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

// async function findUserAssetsWithMoralis(owner: string) {
//     const polygonNFTs = await Moralis.Web3API.account.getNFTs({
//         chain: 'mumbai',
//         address: owner
//     });
// }
