'use client';

import { useState, useEffect, useCallback } from "react";
//import { debounce } from 'lodash';
import { Input } from "./ui/input";
import { formatPrice } from "@/lib/format";

const BASE_URL = process.env.NEXT_PUBLIC_FLASK_API_URL

type LiveCoinData = {
    id: string;
    name: string;
    symbol?: string;
    label?: string;
    current_price: number;
    market_cap: number;
    high_24h: number;
    low_24h: number;
    price_change_percentage_24h: number;
    image: string;
};

export default function GlobalSearch(){
    const [query, setQuery] = useState("");
    const [autoCompleteResults, setAutoCompleteResults] = useState<any[]>([]);
    const [results, setResults] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedOption, setSelectedOption] = useState<any | null>(null);
    const [selectedCoinData, setSelectedCoinData] = useState<LiveCoinData | null>(null);
    const [suppressComplete, setSuppressComplete] = useState(false);

    /*const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(query.trim() !== ""){
            return
        }
    };*/

    useEffect(() => {
        if(selectedOption || suppressComplete) return;

        if(query.length < 2){
            setAutoCompleteResults([]);
            return;
        }

        const fetchAutoComplete = async() => {
            try{
                const res = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
                if(!res.ok) throw new Error('Autocomplete Fetch Failed');
                const data = await res.json();
                const suggestions: any[] = [];

                if (data.coins) {
                    const coinSuggestions = data.coins.map((coin: any) => ({ 
                        label: `${coin.name} (${coin.symbol.toUpperCase()})`, 
                        name: coin.name,   
                        type: 'coin',
                        value: coin.id,
                        image: coin.image,
                        price: coin.current_price,
                    }));
                    suggestions.push(...coinSuggestions);
                    enhanceAutoCompleteResults(data.coins.slice(0,6));
                }
                if (data.wallets) {
                suggestions.push(...data.wallets.map((wallet: any) => ({ type: 'wallet', ...wallet })));
                }
                if (data.users) {
                suggestions.push(...data.users.map((user: any) => ({ type: 'user', ...user })));
                }
                if (data.user_settings) {
                suggestions.push(...data.user_settings.map((setting: any) => ({ type: 'setting', ...setting })));
                }
                setAutoCompleteResults(suggestions.slice(0,6));
            } catch(err){
                console.error(err);
                setAutoCompleteResults([]);
            }
        };

        const debounce = setTimeout(fetchAutoComplete, 300);
        return () => clearTimeout(debounce);
    }, [query, selectedOption, suppressComplete]);

    const handleSearch = async() => {
        setSuppressComplete(true);
        setLoading(true);
        setError(null);
        setResults({});
        setAutoCompleteResults([]);
        setSelectedOption(null);

        if(!query.trim()) return

        try{
            const res = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}`)
            if(!res.ok) throw new Error("Search Failed")
            
            const data = await res.json()

            if (data.coins?.length > 0) {
                try {
                    const ids = data.coins.map((coin: any) => coin.id).join(',');
                    const resLive = await fetch(`${BASE_URL}/api/coingecko/coins/markets?vs_currency=usd&ids=${ids}`);
                    const marketData = await resLive.json();

                    const enhancedCoins = data.coins.map((coin: any) => {
                        const live = marketData.find((m: any) => m.id === coin.id);
                        return {
                            ...coin,
                            current_price: live?.current_price,
                            market_cap: live?.market_cap,
                            high_24h: live?.high_24h,
                            low_24h: live?.low_24h,
                            price_change_percentage_24h: live?.price_change_percentage_24h,
                            image: live?.image || coin.image,
                        };
                    });

                    data.coins = enhancedCoins;
                } catch (e) {
                    console.error("⚠️ Failed to enhance coin results:", e);
                }
            }

            setResults(data);

        } catch(err: any){
            setError(err.message || "Something went wrong")
        } finally{
            setLoading(false)
        }
    }

    async function fetchLiveCoinData(coinId: string): Promise<LiveCoinData>{
        console.log('Fetching live data for:', coinId);
        const res = await fetch(`${BASE_URL}/api/coingecko/coins/markets?vs_currency=usd&ids=${coinId}`);
        if(!res.ok){
            const errorText = await res.text();
            console.error(`Failed to fetch live data for ${coinId}. Status: ${res.status}, Message: ${errorText}`);
            throw new Error(`Failed to fetch live coin data for ${coinId}`);
        }
        const data = await res.json();

        if(!Array.isArray(data) || data.length === 0){
            console.error(`No data for ${coinId}:`, data);
            throw new Error(`No market data for ${coinId}`);
        }

        return data[0];
    }

    const enhanceAutoCompleteResults = async(coins: any[]) => {
        if(!coins || coins.length === 0) return;

        try {
            // Build a comma-separated string of coin IDs
            const ids = coins.map((coin) => coin.id).join(',');

            // Fetch all 6 coins in a single request
            const res = await fetch(`${BASE_URL}/api/coingecko/coins/markets?vs_currency=usd&ids=${ids}`);
            if (!res.ok) throw new Error('Failed to fetch batched live coin data');

            const marketData = await res.json();

            // Map market data back to the original coins
            const enhanced = coins.map((coin) => {
                const live = marketData.find((m: any) => m.id === coin.id);

                return {
                    ...coin,
                    label: coin.label || `${live?.name || coin.name} (${live?.symbol?.toUpperCase() || coin.symbol?.toUpperCase() || ""})`,
                    current_price: live?.current_price,
                    market_cap: live?.market_cap,
                    high_24: live?.high_24h,
                    low_24: live?.low_24h,
                    price_change_percentage_24h: live?.price_change_percentage_24h,
                    image: live?.image || coin.image,
                };
            });

            setAutoCompleteResults(enhanced);
        } catch (e) {
            console.error('❌ Failed to enhance autocomplete:', e);
            setAutoCompleteResults(coins);
        }
    };

    const handleSearchSelect = async (item: any) => {
        try{
            setQuery(item.name);
            setSelectedOption(item);
            setAutoCompleteResults([]);

            const liveData: LiveCoinData = await fetchLiveCoinData(item.id);
            console.log('Live coin data: ', liveData);

            setSelectedCoinData({
                ...item,
                id: item.id || item.value,
                name: liveData.name,
                symbol: item.symbol || "",
                label: `${liveData.name} (${item.symbol?.toUpperCase() || ""})`,
                current_price: liveData.current_price,
                market_cap: liveData.market_cap,
                high_24h: liveData.high_24h,
                low_24h: liveData.low_24h,
                price_change_percentage_24h: liveData.price_change_percentage_24h,
                image: liveData.image
            });
        } catch(e){
            console.error('Failed to fetch live data:', e);
        }
    }

    return (
        <div className="relative p-4 w-full max-w-xl space-y-4">
            {/* Search input */}
            <Input
            type="text"
            placeholder="Search coins, wallets, users..."
            value={query}
            onChange={(e) => {
                setQuery(e.target.value); 
                setSuppressComplete(false);
            }}
            className="w-full p-2"
            />

            {/* Search button */}
            <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
            Search
            </button>

            {/* Autocomplete dropdown */}
            {autoCompleteResults.length > 0 && (
                <ul className="absolute w-full bg-background border mt-1 rounded shadow z-50 max-h-60 overflow-auto">
                {autoCompleteResults.map((item, i) => (
                        <li
                            key={i}
                            className="flex items-center justify-between p-2 hover:bg-muted cursor-pointer"
                            onClick={() => handleSearchSelect(item)}
                        >
                            <div className="flex items-center space-x-3">
                            {item.image && (
                                <img
                                src={item.image}
                                alt={item.label}
                                className="w-6 h-6 rounded-full"
                                />
                            )}
                            <span className="font-medium">
                                {item.label}
                            </span>
                            </div>

                            {typeof item.price_change_percentage_24h === "number" && (
                            <span
                                className={`text-sm ${
                                item.price_change_percentage_24h >= 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                            >
                                {item.price_change_percentage_24h.toFixed(2)}%
                            </span>
                            )}
                        </li>
                    ))
                }
                </ul>
            )}
            

            {/* Loading/Error states */}
            {loading && <p className="text-gray-500">Searching...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {/* Search Results */}
            {Object.keys(results).length > 0 && (
            <div className="space-y-4 mt-4">
                {results.coins?.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold">🪙 Coins</h3>
                    <ul className="space-y-1">
                    {results.coins.map((coin: any) => (
                        <li
                        key={coin.id}
                        className="border p-2 rounded flex items-center space-x-3"
                        >
                        <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                        <div className="flex-1">
                            <span className="font-semibold">
                            {coin.name} ({coin.symbol.toUpperCase()})
                            </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {formatPrice(coin.current_price)}
                        </span>
                        </li>
                    ))}
                    </ul>
                </div>
                )}

                {results.wallets?.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold">🔑 Wallets</h3>
                    <ul>
                    {results.wallets.map((wallet: any, i: number) => (
                        <li key={i} className="border p-2 rounded">{wallet.address}</li>
                    ))}
                    </ul>
                </div>
                )}

                {results.users?.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold">👤 Users</h3>
                    <ul>
                    {results.users.map((user: any, i: number) => (
                        <li key={i} className="border p-2 rounded">
                        {user.username || user.email}
                        </li>
                    ))}
                    </ul>
                </div>
                )}

                {results.user_settings?.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold">⚙️ Settings</h3>
                    <ul>
                    {results.user_settings.map((setting: any, i: number) => (
                        <li key={i} className="border p-2 rounded">
                        Wallet: {setting.wallet}
                        </li>
                    ))}
                    </ul>
                </div>
                )}
            </div>
            )}
        </div>
    );
}