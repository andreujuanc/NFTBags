import { useEffect } from "react"
import { erc20ABI, useConnect, useContract, useProvider } from "wagmi"
import { Button } from "../components/button"

export const Connect = () => {
    const [{ data, error, loading, }, connect] = useConnect()
    

    if (data.connected) {
        const chainId = data.connector?.getProvider(false).chainId
        return (
            <Button onClick={() => { }} >
                Disconnect from {chainId}
            </Button>
        )
    }

    return (
        <Button key={'connect-metamask'} onClick={async () => {
            console.log('lala', (await connect(data.connectors[0]))?.data?.chain)
        }}>
            Connect
        </Button>
    )
}