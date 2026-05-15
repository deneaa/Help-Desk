import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import type { WeeklyTicket } from "../../types/types";

Chart.register(...registerables);

interface IData {
  data: WeeklyTicket[];
}

const WeeklyChart = ({ data }: IData) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const isDark = matchMedia("(prefers-color-scheme: dark)").matches;
    const barColor = isDark ? "#7c6ff7" : "#7c3aed";
    const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
    const labelColor = isDark ? "#a0a0a0" : "#6b7280";

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: data.map((d) => d.week),
        datasets: [
          {
            label: "Tickets",
            data: data.map((d) => d.tickets),
            backgroundColor: barColor,
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                ` ${ctx.parsed.y} ticket${ctx.parsed.y !== 1 ? "e" : ""}`,
            },
            backgroundColor: isDark ? "#1e1e2e" : "#fff",
            titleColor: isDark ? "#e0e0e0" : "#111",
            bodyColor: isDark ? "#a0a0a0" : "#555",
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
            borderWidth: 1,
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: labelColor, font: { size: 12 } },
            border: { display: false },
          },
          y: {
            grid: { color: gridColor },
            border: { display: false },
            ticks: {
              color: labelColor,
              font: { size: 12 },
              stepSize: 1,
              callback: (v) => (Number.isInteger(v) ? v : null),
            },
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [data]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="mb-6">
        <h2 className="text-gray-900 font-medium">Weekly tickets</h2>
        <p className="text-gray-500 text-sm">
          Number of tickets created per week
        </p>
      </div>
      <div className="relative w-full h-[280px]">
        <canvas ref={canvasRef} aria-label="Weekly ticket counts per week" />
      </div>
    </div>
  );
};

export default WeeklyChart;
