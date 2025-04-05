import { ethers } from "ethers";

// Update the URL to the Sepolia RPC endpoint
export function getProvider() {
  return new ethers.providers.JsonRpcProvider("https://virtual.sepolia.rpc.tenderly.co/c53d9f7f-22af-4504-b21d-befad728c9d3", {
    name: "sepolia",
    chainId: 11155111, // Sepolia chain ID
  });
}

export async function getSigner() {
  const provider = getProvider();
  return provider.getSigner();
}