declare module 'react-plotly.js' {
  import Plotly from 'plotly.js';
  import * as React from 'react';

  export interface PlotParams {
    data: Partial<Plotly.PlotData>[];
    layout?: Partial<Plotly.Layout>;
    config?: Partial<Plotly.Config>;
    style?: React.CSSProperties;
    className?: string;
    onInitialized?: (figure: Plotly.Figure, graphDiv: HTMLDivElement) => void;
    onUpdate?: (figure: Plotly.Figure, graphDiv: HTMLDivElement) => void;
  }

  const Plot: React.FC<PlotParams>;
  export default Plot;
}