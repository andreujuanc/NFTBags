import { Asset, AssetType } from "../components/assets"

export type MoralisToken = {
    amount: string,
    contract_type: string
    name: string,
    token_address: string,
    token_id: string
    token_uri: string
    symbol: string
}

function mapMoralisToAsset(items: MoralisToken[]) {
    return items.map(x => {
        return {
            id: `${x.token_address}-${x.token_id}`,
            name: x.name,
            symbol: x.symbol,
            address: x.token_address,
            tokenId: x.token_id,
            type: x.contract_type == "ERC1155" ? AssetType.ERC1155 : x.contract_type == "ERC721" ? AssetType.ERC721 : AssetType.ERC20
        }
    })
}

export async function findUserAssetsWithMoralis(owner: string): Promise<Asset[]> {
    try {
        const response = await fetch(`https://deep-index.moralis.io/api/v2/${owner}/nft?chain=mumbai&format=decimal`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY ?? ''
            }
        })
        return mapMoralisToAsset((await response.json()).result)

    } catch (e) {
        console.error('findUserAssetsWithMoralis', e)
        return []
    }
}


async function findWithMoralis(owner: string, contract: string) {
    try {
        const response = await fetch(`https://deep-index.moralis.io/api/v2/${owner}/nft/${contract}?chain=mumbai&format=decimal`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY ?? ''
            }
        })
        return mapMoralisToAsset((await response.json()).result)
    } catch (e) {
        console.error('findWithMoralis', e)
        return []
    }
}
