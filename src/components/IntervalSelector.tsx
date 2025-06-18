'use client';
import { useState } from "react";
import {addHours, addDays, subMonths, subWeeks} from "date-fns"
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";


type Props = {
    onIntervalSelect: (start: number, end: number) => void
}

export default function IntervalSelector({onIntervalSelect}: Props){
    const [input, setInput] = useState('');
    const [error, setError] = useState('');

    function handleSubmit(){
        const now = new Date()
        let start: Date

        const trimmed = input.trim().toLowerCase()

        if(trimmed.endsWith('h')){
            const hours = parseInt(trimmed.replace('h',''),10)
            if (isNaN(hours)) return setError('Invalid number of hours.')
            start = addHours(now, -hours)
        } else if(trimmed.endsWith('d')){
            const days = parseInt(trimmed.replace('d',''),10)
            if (isNaN(days)) return setError('Invalid number of days.')
            start = addDays(now, -days)
        } else if(trimmed.endsWith('w')){
            const weeks = parseInt(trimmed.replace('w',''),10)
            if (isNaN(weeks)) return setError('Invalid number of weeks.')
            start = subWeeks(now, weeks)
        } else if(trimmed.endsWith('m')){
            const months = parseInt(trimmed.replace('m',''), 10)
            if (isNaN(months)) return setError('Invalid number of months.')
            start = subMonths(now, months)
        } else{
            return setError("❌ Invalid format. Use '1h', '1d', '1w', '1m' etc.")
        }

        const start_unix = Math.floor(start.getTime() / 1000)
        const end_unix = Math.floor(now.getTime() / 1000)
        setError('')
        onIntervalSelect(start_unix, end_unix)
    }

    return(
    <div className="space-y-4">
      <Label htmlFor="interval">Enter time interval (e.g. 1h, 6h, 1d, 7d, 1m, 3m):</Label>
      <Input
        id="interval"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button onClick={handleSubmit} className="mb-2">Submit Interval</Button>
    </div>
    )

}