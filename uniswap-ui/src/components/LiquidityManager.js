import React, { useState } from "react";
import { getSigner } from "../utils/ethersSetup";
import { ethers } from "ethers";
import config from "../config.json";


const routerABI = [
  "function addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to) external returns (uint256, uint256, uint256)"
];

const pairABI = [
  "function balanceOf(address owner) external view returns (uint256)",
  "function totalSupply() external view returns (uint256)",
  "function burn(address to) external returns (uint256 amount0, uint256 amount1)",
  "function transfer(address to, uint256 amount) external returns (bool)"
];

const erc20ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)"
];


function formatErrorMessage(error) {

  let shortMsg = "Transaction failed";

  if (error?.error?.body) {
    try {
      const bodyObj = JSON.parse(error.error.body);
      if (bodyObj?.error?.data?.message) {
        shortMsg += `: ${bodyObj.error.data.message}`;
        return shortMsg;
      }
      if (bodyObj?.error?.message) {
        shortMsg += `: ${bodyObj.error.message}`;
        return shortMsg;
      }
    } catch (parseErr) {

    }
  }


  if (error?.message) {
    shortMsg += `: ${error.message}`;
    return shortMsg;
  }


  if (error?.reason) {
    shortMsg += `: ${error.reason}`;
    return shortMsg;
  }


  return shortMsg;
}

export default function LiquidityManager({ pool }) {
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [status, setStatus] = useState("");

  const routerAddress = config.ROUTER_ADDRESS;

  const handleAddLiquidity = async () => {
    try {
      setStatus("Adding liquidity...");
      const signer = await getSigner();
      const userAddr = await signer.getAddress();


      const tokenAContract = new ethers.Contract(pool.tokenA, erc20ABI, signer);
      const tokenBContract = new ethers.Contract(pool.tokenB, erc20ABI, signer);
      const approvalAmount = ethers.constants.MaxUint256;

      let tx = await tokenAContract.approve(routerAddress, approvalAmount);
      await tx.wait();
      tx = await tokenBContract.approve(routerAddress, approvalAmount);
      await tx.wait();

      const routerContract = new ethers.Contract(routerAddress, routerABI, signer);
      tx = await routerContract.addLiquidity(
        pool.tokenA,
        pool.tokenB,
        ethers.utils.parseEther(amountA),
        ethers.utils.parseEther(amountB),
        ethers.utils.parseEther("0"),
        ethers.utils.parseEther("0"),
        userAddr,
        { gasLimit: 1000000 }
      );
      setStatus("Transaction sent: " + tx.hash);
      await tx.wait();
      setStatus("Liquidity added successfully!");
    } catch (error) {
      console.error("Add liquidity error:", error);
      setStatus(formatErrorMessage(error));
    }
  };

  const handleRemoveLiquidity = async () => {
    try {
      setStatus("Removing liquidity...");
      const signer = await getSigner();
      const userAddr = await signer.getAddress();

      const pairContract = new ethers.Contract(pool.address, pairABI, signer);
      const lpBalance = await pairContract.balanceOf(userAddr);
      const totalSupply = await pairContract.totalSupply();

      if (lpBalance.eq(0) || totalSupply.eq(0)) {
        setStatus("No liquidity tokens available to remove. Please add liquidity first.");
        return;
      }

      const txTransfer = await pairContract.transfer(pool.address, lpBalance);
      await txTransfer.wait();

      const txBurn = await pairContract.burn(userAddr);
      setStatus("Transaction sent: " + txBurn.hash);
      await txBurn.wait();
      setStatus("Liquidity removed successfully!");
    } catch (error) {
      console.error("Remove liquidity error:", error);
      setStatus(formatErrorMessage(error));
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", flex: 1, marginBottom: "1rem" }}>
      <h3>Liquidity Manager</h3>
      <div>
        <input
          type="text"
          placeholder="Token A amount"
          value={amountA}
          onChange={(e) => setAmountA(e.target.value)}
        />
        <input
          type="text"
          placeholder="Token B amount"
          value={amountB}
          onChange={(e) => setAmountB(e.target.value)}
        />
        <button onClick={handleAddLiquidity}>Add Liquidity</button>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleRemoveLiquidity}>Remove Liquidity</button>
      </div>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
}
