'use client';
import { useState } from "react";
import IntervalSelector from "./IntervalSelector";
import GranularitySelector from "./GranularitySelector";
import { Button } from '@/components/ui/button'
import { start } from "repl";

type Props = {
    onSubmit: (start: number, end: number, granularity: string) => void
}

export default function TimeSettingSelector({onSubmit}: Props){
    const [startInterval, setStartInterval] = useState<number | null>(null);
    const [endInterval, setEndInterval] = useState<number | null>(null);
    const [granularity, setGranularity] = useState<string>('ONE_HOUR');

    const handleIntervalSubmit = (start: number, end: number) => {
        setStartInterval(start);
        setEndInterval(end);
    }

    const handleGranularityChange = (granularity: string) => {
        setGranularity(granularity)
    }

    const handleSubmit = () => {
        if(startInterval && endInterval && granularity){
            onSubmit(startInterval, endInterval, granularity)
        }
    }

    return(
    <div className="p-6">
      <IntervalSelector onIntervalSelect={handleIntervalSubmit} />
        {startInterval !== null && endInterval !== null && (
            <>
            <GranularitySelector onGranularitySelect={handleGranularityChange}/>
            {granularity && (
                <Button onClick={handleSubmit} className="mt-4">
                Submit Time Settings
                </Button>
          )}
          </>
        )}
    </div>
  )
}