import React, { useState } from "react";
import { getSigner } from "../utils/ethersSetup";
import { ethers } from "ethers";
import config from "../config.json";


const routerABI = [
  "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to) external returns (uint256[])"
];


const tokenOptions = [
  { symbol: "Token A", address: config.TOKEN_A_ADDRESS },
  { symbol: "Token B", address: config.TOKEN_B_ADDRESS },

];

export default function SwapManager({ pool }) {
  const [swapAmount, setSwapAmount] = useState("");
  const [fromToken, setFromToken] = useState(tokenOptions[0].address);
  const [toToken, setToToken] = useState(tokenOptions[1].address);
  const [status, setStatus] = useState("");

  const routerAddress = config.ROUTER_ADDRESS;

  const handleSwap = async () => {
    try {
      setStatus("Swapping...");
      const signer = await getSigner();
      const userAddr = await signer.getAddress();
      const path = [fromToken, toToken];

      const routerContract = new ethers.Contract(routerAddress, routerABI, signer);
      const tx = await routerContract.swapExactTokensForTokens(
        ethers.utils.parseEther(swapAmount),
        0,  
        path,
        userAddr,
        { gasLimit: 1000000 }
      );
      setStatus("Transaction sent: " + tx.hash);
      await tx.wait();
      setStatus("Swap completed successfully!");
    } catch (error) {
      console.error("Swap error:", error);
      setStatus("Error: " + error.message);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", flex: 1, marginBottom: "1rem" }}>
      <h3>Swap Manager</h3>
      <div>
        <label style={{ marginRight: "0.5rem" }}>Amount In:</label>
        <input
          type="text"
          placeholder="Enter amount"
          value={swapAmount}
          onChange={(e) => setSwapAmount(e.target.value)}
          style={{ padding: "0.5rem" }}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "0.5rem" }}>From Token:</label>
        <select
          value={fromToken}
          onChange={(e) => setFromToken(e.target.value)}
          style={{ padding: "0.5rem" }}
        >
          {tokenOptions.map((token) => (
            <option key={token.symbol} value={token.address}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "0.5rem" }}>To Token:</label>
        <select
          value={toToken}
          onChange={(e) => setToToken(e.target.value)}
          style={{ padding: "0.5rem" }}
        >
          {tokenOptions.map((token) => (
            <option key={token.symbol} value={token.address}>
              {token.symbol}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleSwap} style={{ padding: "0.5rem 1rem" }}>Swap</button>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
}
