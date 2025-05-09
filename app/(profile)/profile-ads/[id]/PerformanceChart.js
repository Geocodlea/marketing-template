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
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: "Clicks",
      data: data.map((item) => item.clicks),
      borderColor: "#FF6384",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6,
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
          font: {
            size: 12,
          },
        },
        grid: {
          color: "#444",
        },
      },
      y: {
        ticks: {
          color: "#fff",
          font: {
            size: 12,
          },
        },
        grid: {
          color: "#444",
        },
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
