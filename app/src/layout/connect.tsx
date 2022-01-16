import { useEffect } from "react"
import { erc20ABI, useAccount, useConnect, useContract, useProvider } from "wagmi"
import { Button } from "../components/button"

export const Connect = () => {
    const [{ data: connectData, error, loading, }, connect] = useConnect()
    const [{ data: accountData }] = useAccount()

    if (connectData.connected) {
        const chainId = connectData.connector?.getProvider(false).chainId
        return (
            <Button onClick={() => { }} >
                <div>
                    {accountData?.address.substring(0, 5)}
                    ...
                    {accountData?.address.substring(accountData?.address.length - 4)}
                </div>
                <div  style={{
                    fontSize: '8pt'
                }}>
                    {chainId === '0x13881' && 'Polygon Mumbai'} 
                    {chainId === '0x7a69' && 'Localhost'}
                </div>
            </Button>
        )
    }

    return (
        <Button key={'connect-metamask'} onClick={async () => {
            console.log('lala', (await connect(connectData.connectors[0]))?.data?.chain)
        }}>
            Connect
        </Button>
    )
}