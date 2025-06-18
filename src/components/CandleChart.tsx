'use-client';
import Plot from 'react-plotly.js';

type CandleDataPoint = {
    start: number,
    low: number,
    high: number,
    open: number,
    close: number,
    volume: number
}

type Props = {
    data: CandleDataPoint[];
}

export default function CandleChart({data} : Props){
    const timestamps = data.map(d => new Date(d.start * 1000));
    const low = data.map(d => d.low);
    const high = data.map(d => d.high);
    const open = data.map(d => d.open);
    const close = data.map(d => d.close);
    const volume = data.map(d => d.volume);
}

