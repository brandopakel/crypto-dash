"use client";

import dynamic from "next/dynamic";

const DynamicPlot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
});

export default DynamicPlot;