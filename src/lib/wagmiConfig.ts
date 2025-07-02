import {createConfig, WagmiProvider, http} from 'wagmi';
import {mainnet, polygon, optimism, arbitrum, base, type Chain} from 'wagmi/chains';
import {getDefaultWallets, RainbowKitProvider, darkTheme} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css'

const chains = [mainnet, polygon, optimism, arbitrum, base] as const

const {connectors} = getDefaultWallets({
    appName: 'BP Dash',
    projectId: '372651595858f95701c74017d9e058f1'
})

export const wagmiConfig = createConfig({
    chains: chains, 
    connectors: connectors,
    ssr: true,
    transports: {
        [mainnet.id]: http(),
        [polygon.id]: http(),
        [optimism.id]: http(),
        [arbitrum.id]: http(),
        [base.id]: http(),
    }
})

console.log('WalletConnect initialized once')