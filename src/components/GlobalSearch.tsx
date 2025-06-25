'use client';

import { useState, useEffect, useCallback } from "react";
//import { debounce } from 'lodash';
import { Input } from "./ui/input";
import { formatPrice } from "@/lib/format";

const BASE_URL = process.env.NEXT_PUBLIC_FLASK_API_URL

export default function GlobalSearch(){
    const [query, setQuery] = useState("");
    const [autoCompleteResults, setAutoCompleteResults] = useState<any[]>([]);
    const [results, setResults] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedOption, setSelectedOption] = useState<any | null>(null);

    /*const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(query.trim() !== ""){
            return
        }
    };*/

    useEffect(() => {
        if(selectedOption) return;

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
                    suggestions.push(...data.coins.map((coin: any) => ({ 
                        label: `${coin.name} (${coin.symbol.toUpperCase()})`, 
                        name: coin.name,   
                        type: 'coin',
                        value: coin.id,
                        image: coin.image,
                        price: coin.current_price,
                    })));
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
    }, [query, selectedOption]);

    const handleSearch = async() => {
        setLoading(true);
        setError(null);
        setResults({});
        setAutoCompleteResults([]);

        if(!query.trim()) return

        try{
            const res = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}`)
            if(!res.ok) throw new Error("Search Failed")
            
            const data = await res.json()

            setResults(data)

        } catch(err: any){
            setError(err.message || "Something went wrong")
        } finally{
            setLoading(false)
        }
    }

    const handleSearchSelect = (item: any) => {
        setQuery(item.name);
        setSelectedOption(item);
        setAutoCompleteResults([]);
    }

    return(
        <div className="relative p-4 w-full max-w-xl space-y-4">
            <Input
                type="text"
                placeholder="Search coins, wallets, users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
            {autoCompleteResults.map((item, i) => (
                <li
                key={i}
                className="flex items-center space-x-3 p-2 hover:bg-muted cursor-pointer"
                onClick={() => handleSearchSelect(item)} // or set query, etc.
                >
                {item.type === 'coin' && (
                    <>
                    <img src={item.image} alt={item.label} className="w-6 h-6 rounded-full" />
                    <div className="flex flex-col">
                        <span className="font-medium">{item.label}</span>
                        {item.price && (
                        <span className="text-sm text-muted-foreground">{formatPrice(item.price)}</span>
                        )}
                    </div>
                    </>
                )}
                </li>
            ))}

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
                            <li key={coin.id} className="border p-2 rounded flex items-center space-x-3">
                                <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                                <div className="flex-1">
                                <span className="font-semibold">{coin.name} ({coin.symbol.toUpperCase()})</span>
                                </div>
                                <span className="text-sm text-muted-foreground">{formatPrice(coin.current_price)}</span>
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
                            <li key={i} className="border p-2 rounded">{user.username || user.email}</li>
                            ))}
                        </ul>
                        </div>
                    )}

                    {results.user_settings?.length > 0 && (
                        <div>
                        <h3 className="text-lg font-semibold">⚙️ Settings</h3>
                        <ul>
                            {results.user_settings.map((setting: any, i: number) => (
                            <li key={i} className="border p-2 rounded">Wallet: {setting.wallet}</li>
                            ))}
                        </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}