"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const EmailGraph = ({ emailData }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Format date as "MMM d" (e.g., "Apr 24")
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Extract unique days from the data
  const dates = emailData.map((event) =>
    new Date(event.date).setHours(0, 0, 0, 0)
  );
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  // Generate daily labels
  const labels = [];
  for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
    labels.push(formatDate(new Date(d)));
  }

  // Calculate cumulative counts for each parameter
  const sentData = labels.map((_, i) => {
    const endOfDay = new Date(minDate);
    endOfDay.setDate(minDate.getDate() + i);
    endOfDay.setHours(23, 59, 59, 999);
    return emailData.filter(
      (event) => new Date(event.date) <= endOfDay && event.event === "requests"
    ).length;
  });
  const deliveredData = labels.map((_, i) => {
    const endOfDay = new Date(minDate);
    endOfDay.setDate(minDate.getDate() + i);
    endOfDay.setHours(23, 59, 59, 999);
    return emailData.filter(
      (event) => new Date(event.date) <= endOfDay && event.event === "delivered"
    ).length;
  });
  const estimatedOpenersData = labels.map((_, i) => {
    const endOfDay = new Date(minDate);
    endOfDay.setDate(minDate.getDate() + i);
    endOfDay.setHours(23, 59, 59, 999);
    return emailData.filter(
      (event) =>
        new Date(event.date) <= endOfDay && event.event === "loadedByProxy"
    ).length;
  });
  const trackableOpenersData = labels.map((_, i) => {
    const endOfDay = new Date(minDate);
    endOfDay.setDate(minDate.getDate() + i);
    endOfDay.setHours(23, 59, 59, 999);
    return emailData.filter(
      (event) => new Date(event.date) <= endOfDay && event.event === "opened"
    ).length;
  });
  const uniqueClickersData = Array(labels.length).fill(0); // Placeholder if no click events
  const bouncedData = Array(labels.length).fill(0); // Placeholder if no bounce events

  // Create the chart
  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Sent",
            data: sentData,
            borderColor: "#00008B",
            backgroundColor: "rgba(0, 0, 139, 0.1)",
            fill: true,
            tension: 0.3,
            pointRadius: 3,
            borderWidth: 2,
          },
          {
            label: "Delivered",
            data: deliveredData,
            borderColor: "#1E90FF",
            backgroundColor: "rgba(30, 144, 255, 0.1)",
            fill: true,
            tension: 0.3,
            pointRadius: 3,
            borderWidth: 2,
          },
          {
            label: "Estimated openers",
            data: estimatedOpenersData,
            borderColor: "#00FFFF",
            backgroundColor: "rgba(0, 255, 255, 0.1)",
            fill: true,
            tension: 0.3,
            pointRadius: 3,
            borderWidth: 2,
          },
          {
            label: "Trackable openers",
            data: trackableOpenersData,
            borderColor: "#87CEEB",
            backgroundColor: "rgba(135, 206, 235, 0.1)",
            fill: true,
            tension: 0.3,
            pointRadius: 3,
            borderWidth: 2,
          },
          {
            label: "Unique clickers",
            data: uniqueClickersData,
            borderColor: "#32CD32",
            backgroundColor: "rgba(50, 205, 50, 0.1)",
            fill: true,
            tension: 0.3,
            pointRadius: 3,
            borderWidth: 2,
          },
          {
            label: "Bounced",
            data: bouncedData,
            borderColor: "#FF0000",
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            fill: true,
            tension: 0.3,
            pointRadius: 3,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: "top" },
          title: { display: true, text: "Email Campaign Performance" },
        },
        scales: {
          x: {
            title: { display: true, text: "Date" },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: "Count" },
            grid: { color: "rgba(0, 0, 0, 0.1)" },
          },
        },
      },
    });

    // Clean up chart on unmount
    return () => {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    };
  }, [emailData]);

  return (
    <div className="w-full h-96">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default EmailGraph;
