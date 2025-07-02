'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useEffect, useState } from 'react'
import {useWalletModal} from '@solana/wallet-adapter-react-ui'

//<WalletMultiButton className="!h-12 !px-6 !py-3 !rounded-lg !text-base !font-medium !shadow-none !bg-purple-600 hover:!bg-purple-700" />

export default function SolanaConnectButton() {
    const {setVisible} = useWalletModal();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
            <WalletMultiButton className='wallet-adapter-button'/>
    )
}