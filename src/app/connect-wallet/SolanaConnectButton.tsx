'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useEffect, useState } from 'react'
import {useWalletModal} from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react';
import {WalletNotReadyError, WalletReadyState} from '@solana/wallet-adapter-base';

//<WalletMultiButton className="!h-12 !px-6 !py-3 !rounded-lg !text-base !font-medium !shadow-none !bg-purple-600 hover:!bg-purple-700" />

export default function SolanaConnectButton() {
    const {setVisible} = useWalletModal();
    const [mounted, setMounted] = useState(false);
    const {wallet, disconnect} = useWallet();
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const timeout = setTimeout(() => {
        const isInstalled =
            wallet?.adapter?.readyState === 'Installed' ||
            wallet?.adapter?.readyState === 'Loadable';

        if (!isInstalled) {
            // Clean up broken wallet session before WalletMultiButton renders
            console.log('[wallet-adapter] Resetting stale walletName...');
            localStorage.removeItem('walletName');
            indexedDB.deleteDatabase('wallets');
            sessionStorage.setItem('walletReset', 'true');
        }

        setShowButton(true); // Only render WalletMultiButton after this check
        }, 50); // Slight delay to let wallet context settle

        return () => clearTimeout(timeout);
    }, [wallet]);

    /*useEffect(() => {
        if (
        mounted &&
        typeof window !== 'undefined' &&
        wallet?.adapter &&
        wallet.adapter.readyState !== 'Installed' &&
        !sessionStorage.getItem('walletReset')
        ) {
        console.warn(
            `[Patch] Wallet "${wallet.adapter.name}" not installed. Resetting...`
        );

        // Clear broken state
        localStorage.removeItem('walletName');
        indexedDB.deleteDatabase('wallets');
        sessionStorage.setItem('walletReset', 'true');

        // Disconnect just in case
        disconnect?.();

        // Re-open modal
        setTimeout(() => {
            setVisible(true);
        }, 200);
        }
    }, [mounted, wallet, disconnect, setVisible]);*/

    /*const handleClick = () => {
    // Detect NotInstalled wallets before Solana UI throws
        if (
        wallet?.adapter?.readyState === 'NotDetected' &&
        !sessionStorage.getItem('walletReset')
        ) {
        console.log('[Reset] Wallet not detected:', wallet.adapter.name);

        localStorage.removeItem('walletName');
        indexedDB.deleteDatabase('wallets');
        sessionStorage.setItem('walletReset', 'true');

        setTimeout(() => {
            setVisible(true);
        }, 300);
        }
    };*/

    /*useEffect(() => {
        if (
            mounted &&
            typeof window !== 'undefined' &&
            wallet?.adapter?.readyState === 'NotDetected' &&
            !sessionStorage.getItem('walletReset')
        ) {
            console.log('Wallet not detected — clearing state');

            localStorage.removeItem('walletName'); // Clear wallet selection
            indexedDB.deleteDatabase('wallets');   // Optional: Clear IndexedDB cache
            sessionStorage.setItem('walletReset', 'true');

            setTimeout(() => {
            setVisible(true); // Reopen modal so user can select another wallet
            }, 300);
        }
    }, [mounted, wallet, setVisible]);*/

    /*useEffect(() => {
        const checkWalletReady = async() => {
            console.log('mounted:', mounted);
            console.log('disconnect:', disconnect);
            console.log('wallet:', wallet);
            console.log('readyState:', wallet?.adapter?.readyState);
            if (
                mounted &&
                typeof window !== 'undefined' &&
                !disconnect &&
                wallet?.adapter &&
                wallet.adapter.readyState !== 'Installed' &&
                !sessionStorage.getItem('walletReset')
                ) {
                try {
                    // Try triggering connect to check for WalletNotReadyError
                    wallet.adapter.connect?.()
                } catch (err) {
                    if (err instanceof WalletNotReadyError) {
                    console.log('check')
                    // Clear saved wallet if not ready
                    localStorage.removeItem('walletName')
                    indexedDB.deleteDatabase('wallets') // optional: clears IndexedDB
                    sessionStorage.setItem('walletReset', 'true')

                    // Reopen modal after brief delay
                    setTimeout(() => {
                        setVisible(true)
                    }, 300)
                    }
                }
            }
        }

        checkWalletReady()
    }, [mounted, disconnect, wallet, setVisible])*/

    /*useEffect(() => {
        if(!wallet?.adapter || typeof window === 'undefined') return;

        const {name, readyState} = wallet.adapter;

        if(readyState !== WalletReadyState.Installed){
            let url: string | null = null;

            switch (name) {
                case 'Phantom':
                    url = 'https://phantom.app/download';
                    break;
                case 'Solflare':
                    url = 'https://solflare.com/download';
                    break;
                case 'Coinbase':
                    url = 'https://www.coinbase.com/wallet/downloads';
                    break;
                case 'Torus':
                    url = 'https://docs.tor.us/getting-started';
                    break;
                case 'Ledger':
                    url = 'https://www.ledger.com/ledger-live';
                    break;
                default:
                    url = null;
            }

            if (url) {
                console.warn(`${name} is not installed. Redirecting to install page...`);
                disconnect(); // Prevent stuck state
                window.open(url, '_blank');
            }
        }
    },[wallet?.adapter, disconnect]);*/

        /*if(wallet?.adapter && wallet.adapter.readyState !== WalletReadyState.Installed && typeof window!== 'undefined'){
            console.warn(`Wallet "${wallet.adapter.name}" is not ready`);

            try {
                throw new WalletNotReadyError(wallet.adapter.name);
            } catch (error) {
                if (error instanceof WalletNotReadyError) {
                // Reset local storage and connection
                localStorage.removeItem('walletName');
                indexedDB.deleteDatabase('wallets');
                disconnect(); // Clean up connection state
                sessionStorage.removeItem('walletReset'); // optional: reset flag
                window.location.reload(); // reload to restore modal
                }
            }
        }
    }, [wallet, disconnect])*/

    if (!mounted) return null

    return showButton ? (
        <WalletMultiButton className="wallet-adapter-button" />
    ) : null;
}