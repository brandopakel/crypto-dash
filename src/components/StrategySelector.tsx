'use-client';

import { useState } from "react";
import { Checkbox } from "./ui/checkbox";

const strategies = ["Bollinger","MACD","ROC","RSI","SMA","Z-Score","VWAP","OBV","ADX","Ichimoku","Fibonacci","EW","Gartley"]

export default function StrategySelector({onSelect} : {onSelect: (selected: string[]) => void}){
    const [selected, setSelected] = useState<string[]>([]);
    
    const toggle = (strategy: string) => {
        const updated = selected.includes(strategy) ? selected.filter((s) => s !== strategy) : [...selected, strategy];
        setSelected(updated);
        onSelect(updated);
    }

    return(
    <div className="flex flex-col gap-2">
        {strategies.map(strategy => (
            <label key={strategy} className="flex items-center gap-2">
            <Checkbox checked={selected.includes(strategy)} onCheckedChange={() => toggle(strategy)} />
            {strategy}
            </label>
        ))}
    </div>
    )
}