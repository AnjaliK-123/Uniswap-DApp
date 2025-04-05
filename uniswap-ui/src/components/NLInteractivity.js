// src/components/NLInteractivity.js
import React, { useState } from "react";
import { ethers } from "ethers";
import { getSigner } from "../utils/ethersSetup";
import config from "../config.json";


const parseInstruction = (instruction) => {
  const lower = instruction.toLowerCase();

  if (lower.includes("swap")) {
    const match = instruction.match(/swap\s+(\d+\.?\d*)\s+(\w+)\s+for\s+(\w+)/i);
    if (match) {
      return {
        action: "swap",
        amountIn: match[1],
        tokenIn: match[2],
        tokenOut: match[3],
      };
    } else {
      return { error: "Could not parse swap instruction. Use format: 'swap X TOKEN1 for TOKEN2'" };
    }
  }
  else if (lower.includes("deposit") || lower.includes("add liquidity")) {
    const match = instruction.match(/(?:deposit|add liquidity)\s+(\d+\.?\d*)\s+(\w+)\s+and\s+(\d+\.?\d*)\s+(\w+)/i);
    if (match) {
      return {
        action: "addLiquidity",
        amountToken1: match[1],
        token1: match[2],
        amountToken2: match[3],
        token2: match[4],
      };
    } else {
      return { error: "Could not parse liquidity instruction. Use format: 'deposit X TOKEN1 and Y TOKEN2'" };
    }
  }
  // Example for liquidity removal: "redeem liquidity" or "remove liquidity"
  else if (lower.includes("redeem") || lower.includes("remove liquidity")) {
    return { action: "removeLiquidity" };
  }
  return { error: "Instruction not recognized. Please try a different instruction." };
};

export default function NLInteractivity() {
  const [instruction, setInstruction] = useState("");
  const [structuredRepresentation, setStructuredRepresentation] = useState(null);
  const [status, setStatus] = useState("");

  const handleProcess = async () => {
    setStatus("Processing instruction...");
    try {
      const sr = parseInstruction(instruction);
      setStructuredRepresentation(sr);
      if (sr.error) {
        setStatus("Error: " + sr.error);
      } else {
        setStatus("Instruction processed successfully!");
      }
    } catch (error) {
      console.error("NLInteractivity error:", error);
      setStatus("Error: " + error.message);
    }
  };

  return (
    <div className="card" style={{ marginBottom: "2rem" }}>
      <h3>Natural Language Interactivity</h3>
      <textarea
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        placeholder="Enter your instruction (e.g., 'swap 10 USDC for ETH' or 'deposit 5 Tether and 3 WBTC')"
        style={{ width: "100%", height: "100px", padding: "0.75rem" }}
      />
      <button onClick={handleProcess} style={{ padding: "0.75rem 1.5rem", marginTop: "1rem" }}>
        Process Instruction
      </button>
      {status && <p className="status-message">{status}</p>}
      <div style={{ marginTop: "1rem" }}>
        <h4>Structured Representation:</h4>
        <pre
          className="status-message"
          style={{ background: "#2c2a33", padding: "1rem", borderRadius: "8px", color: "#f0f0f0" }}
        >
          {structuredRepresentation ? JSON.stringify(structuredRepresentation, null, 2) : "None"}
        </pre>
      </div>
    </div>
  );
}