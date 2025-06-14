import CoinLoaderContainer from "@/components/CoinLoaderContainer"

export default function Home(){

  return(
    <main className="p-8">
      <h1 className="text-2xl font-bold">Welcome to the Site</h1>
      <p className="mt-2 text-muted-foreground">
        Connect your wallet and receive strategy insights based on live market data. Track your wallet data. Explore what's available.
      </p>
      <CoinLoaderContainer/>
    </main>
  )
}