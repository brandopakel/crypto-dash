'use client';
import { useState } from "react";

type ResolveMethod = 'name' | 'symbol' | 'pair';

export default function ProductIdResolverCB( {onResolved} : {onResolved: (productId: string) => void;} ) {
    const [resolveMethod, setResolveMethod] = useState<ResolveMethod>('name');
    const [inputValue, setInputValue] = useState('');
    const [resolvedProductId, setResolvedProductId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleResolve = async() => {
        if(!inputValue) return;

        setLoading(true);
        try{
            const res = await fetch('http://localhost:5000/api/resolve_product_id', {
                method : 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({method: resolveMethod, value: inputValue})
            });

            const data = await res.json();

            if(data.product_id){
                setResolvedProductId(data.product_id);
                onResolved(data.product_id);
            }else{
                setResolvedProductId(null);
                alert('Could not resolve product-ID.');
            }
        } catch(err){
            console.error('Error resolving product-ID: ', err);
            alert('Server error while resolving.');
        } finally{
            setLoading(false);
        }
    };

    return(
    <div className="space-y-2">
      <label className="block mb-1 font-semibold">Select Coin Input Method</label>
      <select
        value={resolveMethod}
        onChange={(e) => setResolveMethod(e.target.value as ResolveMethod)}
        className="p-2 rounded text-black"
      >
        <option value="name">Coin Name (e.g. Bitcoin)</option>
        <option value="symbol">Coin Symbol (e.g. BTC)</option>
        <option value="pair">Currency Pair (e.g. BTC-USD)</option>
      </select>

      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter coin name, symbol, or pair"
        className="w-full p-2 rounded text-black"
      />

      <button
        type="button"
        onClick={handleResolve}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Resolving...' : 'Resolve Product ID'}
      </button>

      {resolvedProductId && (
        <div className="text-sm text-green-300 mt-2">
          ✅ Resolved Product ID: <strong>{resolvedProductId}</strong>
        </div>
      )}
    </div>
    );
}