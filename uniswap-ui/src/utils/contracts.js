import { ethers } from "ethers";
import config from "../config.json";
import RouterArtifact from "../abis/ZuniswapV2Router.json";
import TokenArtifact from "../abis/ERC20Mintable.json";


export const FACTORY_ADDRESS = config.FACTORY_ADDRESS;
export const ROUTER_ADDRESS  = config.ROUTER_ADDRESS;
export const TOKEN_A_ADDRESS = config.TOKEN_A_ADDRESS;
export const TOKEN_B_ADDRESS = config.TOKEN_B_ADDRESS;
export const PAIR_ADDRESS    = config.PAIR_ADDRESS;

export function getProvider() {
  return new ethers.providers.JsonRpcProvider("https://virtual.sepolia.rpc.tenderly.co/c53d9f7f-22af-4504-b21d-befad728c9d3");
}

export async function getSigner() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

export async function getRouterContract() {
  const signer = await getSigner();
  return new ethers.Contract(ROUTER_ADDRESS, RouterArtifact.abi, signer);
}

export function getTokenContract(tokenAddress) {
  const provider = getProvider();
  return new ethers.Contract(tokenAddress, TokenArtifact.abi, provider);
}
