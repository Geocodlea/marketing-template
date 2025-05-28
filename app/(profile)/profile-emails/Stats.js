"use client";

import { useMemo } from "react";
import Chart from "@/components/Common/Chart";
import { shortDate } from "@/utils/helpers";

const EmailGraph = ({ emailData }) => {
  const { labels, datasets } = useMemo(() => {
    const dates = emailData.map((event) =>
      new Date(event.date).setHours(0, 0, 0, 0)
    );
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const labels = [];
    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      labels.push(shortDate(new Date(d)));
    }

    const generateCumulativeData = (eventName) =>
      labels.map((_, i) => {
        const endOfDay = new Date(minDate);
        endOfDay.setDate(minDate.getDate() + i);
        endOfDay.setHours(23, 59, 59, 999);
        return emailData.filter(
          (event) =>
            new Date(event.date) <= endOfDay && event.event === eventName
        ).length;
      });

    return {
      labels,
      datasets: [
        {
          label: "Sent",
          data: generateCumulativeData("requests"),
          borderColor: "#1E90FF",
          backgroundColor: "rgba(30, 144, 255, 0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          borderWidth: 2,
        },
        {
          label: "Delivered",
          data: generateCumulativeData("delivered"),
          borderColor: "#32CD32",
          backgroundColor: "rgba(50, 205, 50, 0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          borderWidth: 2,
        },
        {
          label: "Estimated openers",
          data: generateCumulativeData("loadedByProxy"),
          borderColor: "#FFD700",
          backgroundColor: "rgba(255, 215, 0, 0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          borderWidth: 2,
        },
        {
          label: "Trackable openers",
          data: generateCumulativeData("opened"),
          borderColor: "#FF6347",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          borderWidth: 2,
        },
        {
          label: "Unique clickers",
          data: Array(labels.length).fill(0),
          borderColor: "#FF1493",
          backgroundColor: "rgba(255, 20, 147, 0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          borderWidth: 2,
        },
        {
          label: "Bounced",
          data: Array(labels.length).fill(0),
          borderColor: "#FF4500",
          backgroundColor: "rgba(255, 69, 0, 0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          borderWidth: 2,
        },
      ],
    };
  }, [emailData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
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
      title: {
        display: true,
        text: "Email Campaign Performance",
        color: "#fff",
        font: {
          size: 16,
          weight: "600",
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          color: "#fff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
          font: {
            size: 12,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Count",
          color: "#fff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#fff",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return <Chart type="line" data={{ labels, datasets }} options={options} />;
};

export default EmailGraph;
