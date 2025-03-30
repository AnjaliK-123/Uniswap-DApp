import React, { useState } from "react";
import TokenBalance from "./components/TokenBalance";
import PoolSelector from "./components/PoolSelector";
import MintTokens from "./components/MintTokens";
import LiquidityManager from "./components/LiquidityManager";
import SwapManager from "./components/SwapManager";
import ReservesChart from "./components/ReservesChart";
import PriceDistributionChart from "./components/PriceDistributionChart";
import "./App.css";

import config from "./config.json";


function App() {
  const [selectedPool, setSelectedPool] = useState(null);

  return (
    <div className="app-container">
      <h1>My Uniswap UI</h1>
      <MintTokens /> 
      <TokenBalance />
      <PoolSelector selectedPool={selectedPool} setSelectedPool={setSelectedPool} />
      {selectedPool ? (
        <>
          <div className="flex-container">
            <LiquidityManager pool={selectedPool} />
            <SwapManager pool={selectedPool} />
          </div>
          <ReservesChart pool={selectedPool} />
          <PriceDistributionChart pool={selectedPool} />
        </>
      ) : (
        <p>Please select pool to continue.</p>
      )}
    </div>
  );
}


export default App;
