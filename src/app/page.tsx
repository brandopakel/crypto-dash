'use client';
import CoinGeckoList from "./market/CoinGeckoList"
import CoinLoaderContainer from "@/components/CoinLoaderContainer"
import GlobalSearch from "@/components/GlobalSearch"
import GlobalCryptoDash from "./dashboard/GlobalCryptoDash"
import { Button } from "@/components/ui/button"
import { WalletIcon, LogInIcon } from "lucide-react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import SolanaConnectButton from "./connect-wallet/SolanaConnectButton";
import {WalletMultiButton} from '@solana/wallet-adapter-react-ui';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home(){
  /*const {isConnected} = useAccount();
  const {connected: solanaConnected} = useWallet()
  const router = useRouter()

  useEffect(() => {
    if(typeof window !== 'undefined'){
      if (isConnected || solanaConnected){
        router.push('/dashboard')
      }
    }
  }, [isConnected, solanaConnected])*/

  return(
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6">
        Crypto Strategy Hub
      </h1>
      <p className="text-lg sm:text-xl text-muted-foreground mb-10 text-center max-w-xl">
        Visualize strategies, analyze coins, and track wallet performance — all in one place.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/dashboard">
          <Button
            size="lg"
            variant="secondary"
            className="h-12 px-6 text-base font-semibold rounded-2xl bg-zinc-800 text-white hover:bg-gray-700 transition-all text-base font-semibold flex items-center cursor-pointer"
          >
            <LogInIcon className="ml-1 h-5 w-5" />
            Enter Site
          </Button>
        </Link>

        <div className="w-64 sm:w-auto">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected = ready && account && chain;

              return (
                <button
                  disabled={!ready}
                  onClick={connected ? openAccountModal : openConnectModal}
                  className="w-full h-12 px-6 bg-blue-600 hover:bg-blue-900 text-white font-semibold rounded-2xl transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {connected ? `${account.displayName}` : 'Connect Wallet'}
                </button>
              );
            }}
          </ConnectButton.Custom>
        </div>

        <div className="w-64 sm:w-auto">
          <SolanaConnectButton/>
        </div>
      </div>
    </div>
  )
}