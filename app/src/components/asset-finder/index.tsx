import { BaseProvider, getDefaultProvider, JsonRpcProvider } from "@ethersproject/providers";
import { Contract } from "ethers";
import { useState } from "react";
import { erc20ABI, erc721ABI, erc1155ABI, useConnect, } from "wagmi";
import { erc165Abi } from "../../abis/ERC154";
import { Asset, AssetType } from "../assets";
import { Button } from "../button";
import { Container } from "../container";
import { Input } from "../input";

const ERC1155InterfaceId: string = "0xd9b67a26"
const ERC721InterfaceId: string = "0x80ac58cd"

export function AssetFinder({ onAssetFound }: { onAssetFound: (asset: Asset) => void }) {
    const [asset, setAsset] = useState<Asset | undefined>(undefined)
    //const provider = useProvider()
    const [{ data, error, loading, }, connect] = useConnect()

    const handle_onChange = async (value: string) => {
        const provider = new JsonRpcProvider('http://localhost:8545', {
            name: 'hardhat',
            chainId: await data.connector?.getChainId() ?? 0
        })
        if (!value) {
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

    const handle_721TokenIdChanged = (tokenId: string) => {
        if (asset)
            asset.tokenId = tokenId
    }

    const handle_addClicked = () => {
        if (asset) {
            onAssetFound({ ...asset })
            setAsset(undefined)
        }
    }

    return (
        <div>
            <Container color="#E0E0E0">
                <Input label="Contract Address" onChange={handle_onChange} />
                <div style={{ color: '#444', fontSize: '1rem' }}>
                    {asset && AssetType[asset.type]} {asset && asset.name}
                </div>
                <div>
                    {asset && asset.type == AssetType.ERC721 &&
                        <Input label="Token Id" onChange={handle_721TokenIdChanged} />
                    }
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    flexDirection: 'row',
                    marginTop: '1rem'
                }}>
                    <Button
                        onClick={handle_addClicked}
                        disabled={!asset}
                        backgroundColor="#2a4272"
                        color="#CCC"
                    >
                        Add
                    </Button>
                </div>
            </Container>
            <div>


            </div>
        </div>
    )
}

async function supportsInterface(address: string, provider: BaseProvider, interfaceId: string): Promise<boolean> {
    try {
        const erc165 = new Contract(address, erc165Abi, provider)
        return await erc165.functions.supportsInterface(interfaceId)
    } catch {
        return false
    }

}

async function tryGetContract(address: string, provider: BaseProvider): Promise<Asset | undefined> {
    try {
        if (!await supportsInterface(address, provider, ERC721InterfaceId)) throw new Error()
        const erc721 = new Contract(address, erc721ABI.concat(erc20ABI as any), provider)
        return {
            address: address,
            name: await erc721.functions.name(),
            symbol: '',
            type: AssetType.ERC721,
            selected: true
        }
    }
    catch (e) {
        console.error(e)
    }
    try {

        if (!await supportsInterface(address, provider, ERC1155InterfaceId)) throw new Error()
        const erc1155 = new Contract(address, erc1155ABI, provider)
        const metadataFile = erc1155.functions.uri()
        return {
            address: address,
            name: 'TODO: 1155 name',
            symbol: '',
            type: AssetType.ERC1155,
            selected: true
        }
    }
    catch { }
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

}
