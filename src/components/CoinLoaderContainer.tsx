'use client';
import { useState, useEffect } from "react";
import ProductIdResolverCB from "./ProductIdResolver_cb";
import TimeSettingSelector from "./TimeSettingSelector";
//import Plot from "react-plotly.js";
import DynamicPlot from "./DynamicPlot";
import { Button } from "./ui/button";
import StrategySelector from "./StrategySelector";

export default function CoinLoaderContainer(){
    const [productId, setProductId] = useState<string | null>(null);
    const [coinData, setCoinData] = useState<any>(null);
    const [chartData, setChartData] = useState<any | null>(null);
    const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);

    const handleResolved = (resolvedProductId: string) => {
      setProductId(resolvedProductId);
      setCoinData(null);
      setChartData(null);
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

    const handleChartData = async() => {

      const payload = {
        ...coinData,
        strategies: selectedStrategies
      }

      try{
        const res = await fetch('http://localhost:5000/api/plot-strategy', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload)
        })

        if(!res.ok){
          const errorText = await res.text()
          console.error('❌ Backend error:', errorText)
          throw new Error('Failed to load chart.')
        }

        const data = await res.json();
        setChartData(data);

      } catch(err){
        console.error('❌ Error loading chart:', err)
      }
    }

    useEffect(() => {
      const shouldFetch = coinData?.product_id && coinData?.start && coinData?.end && coinData?.granularity;

      if(shouldFetch) {
        handleChartData();
      }
    }, [coinData, selectedStrategies]);

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
              {!chartData && (<p>Loading...</p>)}

              {chartData && (
                <>
                <DynamicPlot
                data={chartData.data}
                layout={chartData.layout}
                config={{responsive: true}}
                style={{width: '100%'}}
                />

                <div className="w-full mt-6 p-4 bg-background border rounded-xl shadow space-y-4">
                  <h3 className="text-lg font-semibold">Overlay Strategies</h3>
                  <StrategySelector
                    onSelect={(strategies) => setSelectedStrategies(strategies)}
                  />
                </div>
                </>
              )}
          </div>
        )}
      </div>
  );
}