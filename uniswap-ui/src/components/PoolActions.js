// src/components/PoolActions.js
import React from "react";

export default function PoolActions({ pool }) {
  return (
    <div style={{ marginTop: "1rem" }}>
      <h2>Pool: {pool.name}</h2>
      <p>Pool Address: {pool.address}</p>
      <p>Token A: {pool.tokenA}</p>
      <p>Token B: {pool.tokenB}</p>
    </div>
  );
}
