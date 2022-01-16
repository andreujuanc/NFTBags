import hardhat from './hardhat.json'
import mumbai from './mumbai.json'
export function getContractAddresses(chainId: number) {
    if (chainId == 31337)
        return hardhat
    if (chainId == 80001)
        return mumbai
    throw new Error(`Not supported network: ${chainId}`)
}
//0x87fd44131b5346b3077e4cba4b5eb3c807de2af0