import { ethers } from "ethers";

export function getProvider() {

  return new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545",
    { name: "hardhat", chainId: 31337 });
}

export async function getSigner() {
  const provider = getProvider();
  return provider.getSigner();
}
