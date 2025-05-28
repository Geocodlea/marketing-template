"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const ChartComponent = ({ type = "line", data, options }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    // Destroy old chart instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new chart instance
    chartInstanceRef.current = new Chart(ctx, {
      type,
      data,
      options,
    });

    // Cleanup
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [type, data, options]);

  return (
    <div className="w-100 mb-5">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;
