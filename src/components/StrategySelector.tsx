'use-client';

import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";

const strategies = ["Bollinger","MACD","ROC","RSI","SMA","Z-Score","VWAP","OBV","ADX","Ichimoku","Fibonacci","EW","Gartley"]

export default function StrategySelector({onSelect} : {onSelect: (selected: string[], config?: Record<string, any>) => void}){
    const [selected, setSelected] = useState<string[]>([]);

    const [rocThreshold, setRocThreshold] = useState(3);
    const [rocPeriod, setRocPeriod] = useState(14);

    const [ewTrend, setEwTrend] = useState('bullish');
    const [ewOrder, setEwOrder] = useState(0.3);
    
    const toggle = (strategy: string) => {
        const updated = selected.includes(strategy) ? selected.filter((s) => s !== strategy) : [...selected, strategy];
        setSelected(updated);
    };

    const confirmSelection = () => {
        const config: Record<string, any> = {};

        if(selected.includes('ROC')){
            config['ROC'] = {
                threshold: rocThreshold,
                period: rocPeriod
            };
        }

        if(selected.includes('EW')){
            config['EW'] = {
                trend: ewTrend,
                order: ewOrder
            };
        }

        onSelect(selected, config);
    };



    return(
   <div className="flex flex-col gap-4 p-4 border rounded-md">
      {/* Strategy checkboxes */}
      {strategies.map((strategy) => (
        <label key={strategy} className="flex items-center gap-2">
          <Checkbox
            checked={selected.includes(strategy)}
            onCheckedChange={() => toggle(strategy)}
          />
          {strategy}
        </label>
      ))}

      {selected.includes("ROC") && (
        <div className="space-y-2">
          <h4 className="font-semibold">ROC Settings</h4>
          <label className="flex gap-2 items-center">
            Threshold:
            <input
              type="number"
              value={rocThreshold}
              onChange={(e) => setRocThreshold(+e.target.value)}
              className="border p-1 rounded w-20"
            />
          </label>
          <label className="flex gap-2 items-center">
            Period:
            <input
              type="number"
              value={rocPeriod}
              onChange={(e) => setRocPeriod(+e.target.value)}
              className="border p-1 rounded w-20"
            />
          </label>
        </div>
      )}
    
      {selected.includes("EW") && (
        <div className="space-y-2">
            <h4 className="font-semibold">Elliott Wave Settings</h4>

            <label className="flex gap-2 items-center">
            Trend:
            <select
                value={ewTrend}
                onChange={(e) => setEwTrend(e.target.value)}
                className="border p-1 rounded"
            >
                <option value="bullish">Bullish</option>
                <option value="bearish">Bearish</option>
            </select>
            </label>

            <label className="flex gap-2 items-center">
            Sensitivity:
            <input
                type="number"
                step="0.01"
                value={ewOrder}
                onChange={(e) => setEwOrder(+e.target.value)}
                className="border p-1 rounded w-20"
            />
            </label> 
        </div>
        )}

      <Button
        onClick={confirmSelection}
        className="mt-4 bg-primary text-white py-2 px-4 rounded"
      >
        Confirm Selection
      </Button>
      </div>
    );
}