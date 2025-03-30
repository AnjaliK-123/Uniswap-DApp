import React from "react";
import config from "../config.json";


const pools = [
  {
    id: 1,
    name: "Pool A/B",
    tokenA: config.TOKEN_A_ADDRESS,
    tokenB: config.TOKEN_B_ADDRESS,
    address: config.PAIR_ADDRESS,
  }
];

export default function PoolSelector({ selectedPool, setSelectedPool }) {
  return (
    <div>
      <h2>Select a Pool</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {pools.map((pool) => (
          <li key={pool.id} style={{ marginBottom: "1rem" }}>
            <button
              onClick={() => setSelectedPool(pool)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: selectedPool?.id === pool.id ? "#ccc" : "#eee",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {pool.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
