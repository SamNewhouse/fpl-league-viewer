"use client";

import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { TeamHistory } from "../../lib/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FplChartProps {
  allTeamHistory: TeamHistory[];
}

const FplChart: React.FC<FplChartProps> = ({ allTeamHistory }) => {
  const [zoomLoaded, setZoomLoaded] = useState(false);

  useEffect(() => {
    const loadZoomPlugin = async () => {
      if (typeof window !== "undefined") {
        const zoomPlugin = await import("chartjs-plugin-zoom");
        ChartJS.register(zoomPlugin.default);
        setZoomLoaded(true);
      }
    };
    loadZoomPlugin();
  }, []);

  const getRandomColor = (alpha: number = 1): string => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const datasets = allTeamHistory.map((team) => {
    const colour = getRandomColor(1);
    return {
      label: team.teamName,
      data: team.history.map((entry) => entry.total_points),
      borderColor: colour,
      backgroundColor: colour.replace(/[^,]+(?=\))/, "0.2"),
      fill: false,
      tension: 0.6,
      pointBackgroundColor: "white",
      pointBorderColor: colour,
      pointBorderWidth: 2,
      pointHoverBackgroundColor: colour,
      pointHoverBorderColor: colour,
    };
  });

  const chartData: ChartData<"line"> = {
    labels:
      allTeamHistory.length > 0
        ? allTeamHistory[0].history.map((entry) => `GW${entry.event}`)
        : [],
    datasets,
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          labelPointStyle: () => ({
            pointStyle: "circle",
            rotation: 0,
          }),
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
        limits: {
          x: {
            min: 0,
            max: allTeamHistory[0]?.history.length - 1 || 10,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "#222",
          lineWidth: 1,
        },
      },
      y: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "#222",
          lineWidth: 1,
        },
      },
    },
  };

  return (
    <div className="text-white bg-stone-950 p-2 sm:p-4 rounded-md shadow-lg w-full h-[500px] sm:h-[600px] md:h-[700px] overflow-x-auto">
      {!zoomLoaded ? (
        <p>Loading chart...</p>
      ) : (
        <Line data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default FplChart;
