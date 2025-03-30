// src/components/MintTokens.js
import React, { useState } from "react";
import { ethers } from "ethers";
import { getSigner } from "../utils/ethersSetup";
import config from "../config.json";
import ERC20MintableABI from "../abis/ERC20Mintable.json";

export default function MintTokens() {
  const [mintAmount, setMintAmount] = useState("");
  const [status, setStatus] = useState("");

  const tokenAddress = config.TOKEN_A_ADDRESS;

  const handleMint = async () => {
    try {
      setStatus("Minting tokens...");
      const signer = await getSigner();
      const userAddr = await signer.getAddress();

      const tokenContract = new ethers.Contract(tokenAddress, ERC20MintableABI.abi, signer);

      const amountToMint = ethers.utils.parseEther(mintAmount);
      const tx = await tokenContract.mint(amountToMint, userAddr);
      setStatus("Transaction sent: " + tx.hash);
      await tx.wait();
      setStatus("Minting successful! Minted " + mintAmount + " tokens.");
    } catch (error) {
      console.error("Mint error:", error);
      setStatus("Error: " + error.message);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
      <h3>Mint Token A</h3>
      <input
        type="text"
        placeholder="Enter amount to mint"
        value={mintAmount}
        onChange={(e) => setMintAmount(e.target.value)}
      />
      <button onClick={handleMint}>Mint Tokens</button>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
}
