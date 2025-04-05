import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getSigner } from "../utils/ethersSetup";
import { ethers } from "ethers";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const pairABI = [
  "function getReserves() external view returns (uint112, uint112, uint32)",
];

export default function ReservesChart({ pool }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Token A Reserve",
        data: [],
        borderColor: "blue",
        fill: false,
        borderWidth: 2,
      },
      {
        label: "Token B Reserve",
        data: [],
        borderColor: "green",
        fill: false,
        borderWidth: 2,
      },
    ],
  });

  useEffect(() => {
    if (!pool) return;

    const fetchReserves = async () => {
      try {
        const signer = await getSigner();
        const pairContract = new ethers.Contract(pool.address, pairABI, signer);
        console.log("Fetching reserves from contract:", pool.address);    
        const [reserveA, reserveB] = await pairContract.getReserves();
        console.log("Reserve A:", reserveA.toString(), "Reserve B:", reserveB.toString());
        const now = new Date().toLocaleTimeString();

        setChartData((prev) => ({
          ...prev,
          labels: [...prev.labels, now],
          datasets: [
            {
              ...prev.datasets[0],
              data: [
                ...prev.datasets[0].data,
                parseFloat(ethers.utils.formatEther(reserveA))
              ],
            },
            {
              ...prev.datasets[1],
              data: [
                ...prev.datasets[1].data,
                parseFloat(ethers.utils.formatEther(reserveB))
              ],
            },
          ],
        }));
      } catch (err) {
        console.error("Error fetching reserves:", err);
      }
    };


    const interval = setInterval(fetchReserves, 10000);
    fetchReserves();

    return () => clearInterval(interval);
  }, [pool]);

  return (
    <div className="chart-container">
      <h3>Reserves Over Time</h3>
      <Line data={chartData} />
    </div>
  );
}
