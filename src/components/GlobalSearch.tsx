'use client';

import { useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_FLASK_API_URL

export default function GlobalSearch(){
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /*const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(query.trim() !== ""){
            return
        }
    };*/

    const handleSearch = async() => {
        if(!query.trim()) return

        setLoading(true)
        setError(null)

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



    return(
        <div className="p-4 w-full max-w-xl space-y-4">
            <input
                type="text"
                placeholder="Search coins, protocols, wallets..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full border px-3 py-2 rounded-md shadow-sm"
            />
            <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Search
            </button>

            {loading && <p className="text-gray-500">Searching...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {results.length > 0 && (
                <ul className="mt-4 space-y-2">
                {results.map((item, index) => (
                    <li key={index} className="border p-2 rounded bg-gray-900 text-white">
                    {JSON.stringify(item)}
                    </li>
                ))}
                </ul>
            )}
        </div>
    )
}