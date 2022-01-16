import hardhat from './hardhat.json'

export function getContractAddresses(chainId: number) {
    if (chainId == 31337)
        return hardhat
    throw new Error(`Not supported network: ${chainId}`)
}