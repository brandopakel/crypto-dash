'use client';
import { useState } from "react";
import ProductIdResolverCB from "./ProductIdResolver_cb";
import TimeSettingSelector from "./TimeSettingSelector";

export default function CoinLoaderContainer(){
    const [productId, setProductId] = useState<string | null>(null);
    const [coinData, setCoinData] = useState<any>(null);

    const handleResolved = (resolvedProductId: string) => {
      setProductId(resolvedProductId);
      setCoinData(null);
    }

    const handleTimeSettingsSubmit = async(start: number, end: number, granularity: string) => {
      const payload = {
        product_id : productId,
        start,
        end,
        granularity
      }

      try{
        const res = await fetch('http://localhost:5000/api/cb_load', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload)
        })

        if(!res.ok){
          const errorText = await res.text()
          console.error('❌ Backend error:', errorText)
          throw new Error('Failed to load candles.')
        }
        
        const data = await res.json()
        console.log('✅ Candles loaded:', data)
        setCoinData(payload)
      } catch(err){
        console.error('❌ Error loading candles:', err)
      }
    }

    return(
      <div className="p-6 space-y-6">
        <ProductIdResolverCB onResolved={handleResolved} />

        {productId && (
          <TimeSettingSelector onSubmit={handleTimeSettingsSubmit} />
        )}

        {coinData && (
          <div>
            <h2 className="text-xl font-bold mt-4">
              Candles Loaded for {coinData.product_id}
            </h2>
          </div>
        )}
      </div>
  );
}