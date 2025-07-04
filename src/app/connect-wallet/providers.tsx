'use client';

import '@rainbow-me/rainbowkit/styles.css'
import '@solana/wallet-adapter-react-ui/styles.css';
import {getDefaultWallets, RainbowKitProvider, darkTheme} from '@rainbow-me/rainbowkit';
import {createConfig, WagmiProvider, http} from 'wagmi';
import {mainnet, polygon, optimism, arbitrum, base, type Chain} from 'wagmi/chains';
import {ReactNode, useEffect, useMemo, useState} from 'react';

import {ConnectionProvider, WalletProvider} from '@solana/wallet-adapter-react'
import {WalletAdapter, WalletAdapterNetwork, WalletReadyState} from '@solana/wallet-adapter-base'
import {PhantomWalletAdapter, SolflareWalletAdapter, CoinbaseWalletAdapter, TorusWalletAdapter, LedgerWalletAdapter} from '@solana/wallet-adapter-wallets'
import {WalletModalProvider} from '@solana/wallet-adapter-react-ui'
import {clusterApiUrl} from '@solana/web3.js'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import { wagmiConfig } from '@/lib/wagmiConfig';

// --Wagmi V2 Setup (No configureChains) --
/*const chains = [mainnet, polygon, optimism, arbitrum, base] as const

const {connectors} = getDefaultWallets({
    appName: 'BP Dash',
    projectId: '372651595858f95701c74017d9e058f1'
})

const wagmiConfig = createConfig({
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
})*/

// -- Solana Setup --
const solanaNetwork = WalletAdapterNetwork.Mainnet
const solanaEndpoint = clusterApiUrl(solanaNetwork)

function SolanaWalletProviderWrapper({children}: {children: ReactNode}){
    //const [ready, setReady] = useState(false);

    /*useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('walletName');
            localStorage.removeItem('wagmi.connected');
            localStorage.removeItem('walletconnect');
            sessionStorage.setItem('walletReset', 'true');
        }
        setReady(true)
    }, [])*/

    const wallets: WalletAdapter[] = useMemo(() => {
        const adapters = [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
        new CoinbaseWalletAdapter(),
        new TorusWalletAdapter(),
        new LedgerWalletAdapter(),
        ];

        return adapters
        /*return adapters.filter(
            (wallet) => wallet.readyState === WalletReadyState.Installed || wallet.readyState === WalletReadyState.Loadable
        );*/
    }, []);

    //if(!ready) return null;

    return(
        <ConnectionProvider endpoint={solanaEndpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

/*function SolanaWalletResetWrapper({children}: {children: ReactNode}){
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const alreadyReset = localStorage.getItem('walletReset') === 'true';

        if(!alreadyReset){
            localStorage.clear();
            indexedDB.deleteDatabase('wallets')
            localStorage.setItem('walletReset','true')
            window.location.reload()
        } else{
            setReady(true)
        }
    }, [])

    if (!ready) return null

    return <>{children}</>
}*/

// -- Combined Web3 Provider --

const queryClient = new QueryClient()

export function Web3Provider({children} : {children: ReactNode}){
    return(
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={wagmiConfig}>
                <RainbowKitProvider theme={darkTheme()}>
                        <SolanaWalletProviderWrapper>
                            {children}
                        </SolanaWalletProviderWrapper>
                </RainbowKitProvider>
            </WagmiProvider>
        </QueryClientProvider>
    )
}