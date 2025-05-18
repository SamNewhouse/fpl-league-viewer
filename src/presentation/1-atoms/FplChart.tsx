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

  const pastelPalette = [
    "#00FFFF",
    "#FF00FF",
    "#FFFF00",
    "#FFA500",
    "#00FF7F",
    "#87CEFA",
    "#FF7F50",
    "#DA70D6",
    "#FFD700",
    "#FF1493",
  ];

  const getPastelColour = (index: number, alpha: number = 1): string => {
    const base = pastelPalette[index % pastelPalette.length];
    const [r, g, b] = base.match(/\w\w/g)!.map((x) => parseInt(x, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const datasets = allTeamHistory.map((team, index) => {
    const colour = getPastelColour(index, 1);
    return {
      label: team.teamName,
      data: team.history.map((entry) => entry.total_points),
      borderColor: colour,
      backgroundColor: getPastelColour(index, 0.2),
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

  const totalGws = allTeamHistory[0]?.history.length ?? 0;
  const defaultViewGws = 15;

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
        min: Math.max(0, totalGws - defaultViewGws),
        max: totalGws - 1,
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
    <div className="flex text-white bg-stone-950 h-[calc(100%-3rem)] sm:h-[calc(100%-5rem)] p-1 sm:p-3 md:p-6 sm:rounded-lg">
      {!zoomLoaded ? (
        <p>Loading chart...</p>
      ) : (
        <Line data={chartData} options={chartOptions} />
      )}
    </div>
  );
};

export default FplChart;
