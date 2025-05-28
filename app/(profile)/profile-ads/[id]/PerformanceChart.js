"use client";

import Chart from "@/components/Common/Chart";
import { shortDate } from "@/utils/helpers";

const PerformanceChart = ({ data }) => {
  const labels = data.map((item) => shortDate(item.date));
  const datasets = [
    {
      label: "Impressions",
      data: data.map((item) => item.impressions),
      borderColor: "#4BC0C0",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      tension: 0.4,
      fill: false,
    },
    {
      label: "Reach",
      data: data.map((item) => item.reach),
      borderColor: "#36A2EB",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      tension: 0.4,
      fill: false,
    },
    {
      label: "Cost per Result ($)",
      data: data.map((item) => item.costPerResult),
      borderColor: "#9966FF",
      backgroundColor: "rgba(153, 102, 255, 0.2)",
      tension: 0.4,
      fill: false,
    },
    {
      label: "CTR (%)",
      data: data.map((item) => item.ctr),
      borderColor: "#FFCD56",
      backgroundColor: "rgba(255, 205, 86, 0.2)",
      tension: 0.4,
      fill: false,
    },
    {
      label: "Spend ($)",
      data: data.map((item) => item.spend),
      borderColor: "#FF6384",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      tension: 0.4,
      fill: false,
    },
  ];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff",
          boxWidth: 16,
          boxHeight: 16,
          padding: 20,
          font: {
            size: 14,
            weight: "500",
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "#333",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#fff",
          font: { size: 12 },
        },
        grid: { color: "#444" },
      },
      y: {
        ticks: {
          color: "#fff",
          font: { size: 12 },
        },
        grid: { color: "#444" },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  return <Chart type="line" data={{ labels, datasets }} options={options} />;
};

export default PerformanceChart;
