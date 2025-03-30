// uniswap-contracts/scripts/deploy.js
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // 1. Deploy Factory contract
  const Factory = await ethers.getContractFactory("ZuniswapV2Factory");
  const factory = await Factory.deploy();
  await factory.deployed();
  console.log("Factory deployed to:", factory.address);

  // 2. Deploy Library contract
  const Library = await ethers.getContractFactory("ZuniswapV2Library");
  const library = await Library.deploy();
  await library.deployed();
  console.log("Library deployed to:", library.address);

  // 3. Deploy Router contract with the linked library.
  const RouterFactory = await ethers.getContractFactory("ZuniswapV2Router", {
    libraries: {
      ZuniswapV2Library: library.address,
    },
  });
  const router = await RouterFactory.deploy(factory.address);
  await router.deployed();
  console.log("Router deployed to:", router.address);

  // 4. Deploy Token A and Token B using ERC20Mintable
  const ERC20Mintable = await ethers.getContractFactory("ERC20Mintable");
  
  const tokenA = await ERC20Mintable.deploy("Token A", "TKA");
  await tokenA.deployed();
  console.log("Token A deployed to:", tokenA.address);

  const tokenB = await ERC20Mintable.deploy("Token B", "TKB");
  await tokenB.deployed();
  console.log("Token B deployed to:", tokenB.address);

  // 5. Automatically mint tokens to the deployer
  // Use the environment variable TOKENS_TO_MINT or default to "100"
  const tokensToMint = process.env.TOKENS_TO_MINT || "100";
  let tx = await tokenA.mint(ethers.utils.parseEther(tokensToMint), deployer.address);
  await tx.wait();
  console.log(`Minted ${tokensToMint} Token A to:`, deployer.address);

  tx = await tokenB.mint(ethers.utils.parseEther(tokensToMint), deployer.address);
  await tx.wait();
  console.log(`Minted ${tokensToMint} Token B to:`, deployer.address);

  // 6. Create a pair (pool) for Token A and Token B using the factory.
  tx = await factory.createPair(tokenA.address, tokenB.address);
  await tx.wait();
  const pairAddress = await factory.pairs(tokenA.address, tokenB.address);
  console.log("Pair (Pool) deployed to:", pairAddress);

  // 7. Write deployed contract addresses to a config file
  const config = {
    FACTORY_ADDRESS: factory.address,
    LIBRARY_ADDRESS: library.address,
    ROUTER_ADDRESS: router.address,
    TOKEN_A_ADDRESS: tokenA.address,
    TOKEN_B_ADDRESS: tokenB.address,
    PAIR_ADDRESS: pairAddress,
  };

  // Write the config file to uniswap-ui/config.json (adjust the path if needed)
  const configPath = path.join(__dirname, "..", "uniswap-ui", "config.json");
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("Contract addresses saved to:", configPath);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment error:", error);
    process.exit(1);
  });
