import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getSigner } from "../utils/ethersSetup";
import { ethers } from "ethers";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const pairABI = [
  "event Swap(address indexed sender, uint256 amount0Out, uint256 amount1Out, address indexed to)"
];

export default function PriceDistributionChart({ pool }) {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    if (!pool) return;
    let filter;
    let pairContract;

    const subscribeToSwaps = async () => {
      try {
        const signer = await getSigner();
        pairContract = new ethers.Contract(pool.address, pairABI, signer);
        filter = pairContract.filters.Swap();
        pairContract.on(filter, (sender, amount0Out, amount1Out, to, event) => {
          const out0 = parseFloat(ethers.utils.formatEther(amount0Out));
          const out1 = parseFloat(ethers.utils.formatEther(amount1Out));
          const price = out0 > 0 ? out1 / out0 : 0;
          setPrices((prev) => [...prev, price]);
        });
      } catch (err) {
        console.error("Error subscribing to swap events:", err);
      }
    };

    subscribeToSwaps();

    return () => {
      if (pairContract && filter) {
        pairContract.removeAllListeners(filter);
      }
    };
  }, [pool]);


  const buckets = {};
  prices.forEach((price) => {
    const bucket = Math.floor(price * 10) / 10;
    buckets[bucket] = (buckets[bucket] || 0) + 1;
  });
  const labels = Object.keys(buckets).sort((a, b) => parseFloat(a) - parseFloat(b));
  const dataValues = labels.map((label) => buckets[label]);

  const data = {
    labels,
    datasets: [
      {
        label: "Swap Execution Price Distribution",
        data: dataValues,
        backgroundColor: "rgba(75,192,192,0.4)"
      }
    ]
  };

  return (
    <div className="chart-container">
      <h3>Price Distribution</h3>
      <Bar data={data} />
    </div>
  );
}
