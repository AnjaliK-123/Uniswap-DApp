import { ethers } from "ethers";
import FactoryABI from "../abis/ZuniswapV2Factory.json";
import RouterABI from "../abis/ZuniswapV2Router.json";
import TokenABI from "../abis/ERC20Mintable.json";
import PairABI from "../abis/ZuniswapV2Pair.json";

export const FACTORY_ADDRESS = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
export const ROUTER_ADDRESS  = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
export const TOKEN_A_ADDRESS = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";
export const TOKEN_B_ADDRESS = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
export const PAIR_ADDRESS    = "0xf0A8864C5eB258f9b9115Ec0Ab5B77137B09c62c";


export function getProvider() {
  return new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
}

export async function getSigner() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}


export function getFactoryContract() {
  const provider = getProvider();
  return new ethers.Contract(FACTORY_ADDRESS, FactoryABI, provider);
}

export async function getRouterContract() {
  const signer = await getSigner();
  return new ethers.Contract(ROUTER_ADDRESS, RouterABI, signer);
}

export function getTokenContract(tokenAddress) {
  const provider = getProvider();
  return new ethers.Contract(tokenAddress, TokenABI, provider);
}

export async function getPairContract() {
  const provider = getProvider();
  return new ethers.Contract(PAIR_ADDRESS, PairABI, provider);
}
