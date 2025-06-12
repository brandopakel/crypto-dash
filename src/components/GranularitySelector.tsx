'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Props = {
    onGranularitySelect: (granularity: string) => void 
}

const options: {label: string; value: string}[] = [
    { value: "ONE_MINUTE", label: "1 Minute" },
    { value: "FIVE_MINUTE", label: "5 Minutes" },
    { value: "FIFTEEN_MINUTE", label: "15 Minutes" },
    { value: "THIRTY_MINUTE", label: "30 Minutes" },
    { value: "ONE_HOUR", label: "1 Hour" },
    { value: "TWO_HOUR", label: "2 Hours" },
    { value: "SIX_HOUR", label: "6 Hours" },
    { value: "ONE_DAY", label: "1 Day" },
]

export default function GranularitySelector({onGranularitySelect}: Props){
    const [selected, setSelected] = useState("ONE_HOUR")

    const handleChange = (value: string) => {
        setSelected(value)
        onGranularitySelect(value)
    }

    return (
    <div className="space-y-2">
      <Label htmlFor="granularity">Select Granularity:</Label>
      <Select value={selected} onValueChange={handleChange}>
        <SelectTrigger id="granularity">
          <SelectValue placeholder="Select a granularity" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}