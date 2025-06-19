'use client';
import { useState, useEffect } from "react";

//https://api.coingecko.com/api/v3/coins/list
//http://localhost:5000/api/coingecko/coins/list
const BASE_URL = process.env.NEXT_PUBLIC_FLASK_API_URL

interface Coin{
    id: string;
    symbol: string;
    name: string;
}

export default function CoinGeckoList(){
    const [coins, setCoins] = useState<Coin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCoins(){
            try{
                const res = await fetch(`${BASE_URL}/api/coingecko/coins/list`);
                if(!res.ok){
                    const text = await res.text();
                    throw new Error(text);
                }
                const data = await res.json();
                console.log("✅ Direct CoinGecko data:", data.slice(0, 5));
                setCoins(data);
            } catch(err: any){
                console.error("Error fetching coins:", err);
                setError("Failed to load coins");
            } finally{
                setLoading(false);
            }
        }

        fetchCoins();
    }, [])

    if(loading) return <p>Loading coins...</p>;
    if(error) return <p className="text-red-500">{error}</p>;

    return(
    <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">CoinGecko Coin List</h2>
        <div className="max-h-[500px] overflow-y-auto border p-4 rounded bg-background">
            <ul className="space-y-1 text-sm text-muted-foreground">
            {coins.map((coin) => (
                <li key={coin.id}>
                {coin.name} ({coin.symbol})
                </li>
            ))}
            </ul>
        </div>
    </div>
    )
}