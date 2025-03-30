import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getTokenContract, TOKEN_A_ADDRESS } from "../utils/contracts";

const TokenBalance = () => {
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    async function fetchBalance() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const accounts = await provider.listAccounts();

        const tokenA = getTokenContract(TOKEN_A_ADDRESS);
        const bal = await tokenA.balanceOf(accounts[0]);
        setBalance(ethers.utils.formatEther(bal));
      } catch (error) {
        console.error("Error fetching token balance:", error);
      }
    }
    fetchBalance();
  }, []);

  return (
    <div>
      <h2>Token A Balance</h2>
      <p>{balance} TKN A</p>
    </div>
  );
};

export default TokenBalance;
