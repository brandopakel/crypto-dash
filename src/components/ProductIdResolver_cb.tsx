'use client';
import { useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_FLASK_API_URL

type ResolveMethod = 'name' | 'symbol' | 'pair';
type ProductOption = {product_id : string; quote_currency: string};
 
export default function ProductIdResolverCB( {onResolved} : {onResolved: (productId: string) => void;} ) {
    const [resolveMethod, setResolveMethod] = useState<ResolveMethod>('name');
    const [inputValue, setInputValue] = useState('');
    const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
    const [resolvedProductId, setResolvedProductId] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleResolve = async() => {
        if(!inputValue) return;

        setLoading(true);
        try{
            const res = await fetch(`${BASE_URL}/api/resolve_product_id_cb`, {
                method : 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({method: resolveMethod, value: inputValue})
            });

            const data = await res.json();

            if(data.product_ids){
                setProductOptions(data.product_ids)
                setResolvedProductId(data.product_ids[0].product_id);
                setInputValue('')
            }else if(data.product_id){
                setProductOptions([{product_id : data.product_id, quote_currency: data.product_id.split('-')[1]}])
                setResolvedProductId(data.product_id);
                onResolved(data.product_id)
                setInputValue('')
            }else if(data.error){
                alert(`Backend error: ${data.error}`)
            }else{
                alert('Could not resolve product ID.');
            }
        } catch(err){
            console.error('Error resolving product-ID: ', err);
            alert('Server error while resolving.');
        } finally{
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        if(resolvedProductId){
            onResolved(resolvedProductId)
            setResolvedProductId('');
            setProductOptions([]);
        }
    }

    return(
    <div className="space-y-2">
      <div>
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
      </div>

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
        {loading ? 'Resolving...' : 'Resolve Product Options'}
      </button>

      {productOptions.length > 0 && (
        <div>
            <label className="block mb-1 font-semibold">Select Quote Currency</label>
            <select
                value={resolvedProductId}
                onChange={(e) => setResolvedProductId(e.target.value)}
                className="p-2 rounded text-black"
            >
                {productOptions.map(({product_id, quote_currency}) => (
                    <option key={product_id} value={product_id}>{quote_currency} ({product_id})</option>
                ))}
            </select>

            <button
                type="button"
                onClick={handleConfirm}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >Confirm Product ID</button>
        </div>
      )}
    </div>
    );
}