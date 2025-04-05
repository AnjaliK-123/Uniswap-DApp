const { exec } = require("child_process");
const { ethers } = require("hardhat");

console.log("Building UI...");
exec("npm run build", (buildError, buildStdout, buildStderr) => {
  if (buildError) {
    console.error(`Build error: ${buildError.message}`);
    process.exit(1);
  }
  if (buildStderr) {
    console.error(`Build stderr: ${buildStderr}`);
  }
  console.log(`Build stdout: ${buildStdout}`);
  
  console.log("Deploying UI to Vercel...");

  exec("vercel --prod", (deployError, deployStdout, deployStderr) => {
    if (deployError) {
      console.error(`Deploy error: ${deployError.message}`);
      process.exit(1);
    }
    console.log(`Deploy stdout: ${deployStdout}`);
    if (deployStderr) {
      console.error(`Deploy stderr: ${deployStderr}`);
    }
    console.log("UI deployed successfully!");
  });
});

// const { exec } = require("child_process");
// const { ethers } = require("hardhat");

// console.log("Building UI...");
// exec("npm run build", async (buildError, buildStdout, buildStderr) => {
//   if (buildError) {
//     console.error(`Build error: ${buildError.message}`);
//     process.exit(1);
//   }
//   if (buildStderr) {
//     console.error(`Build stderr: ${buildStderr}`);
//   }
//   console.log(`Build stdout: ${buildStdout}`);
  
//   // Deploy smart contracts
//   console.log("Deploying smart contracts...");
//   const [deployer] = await ethers.getSigners(); // Get the deployer signer
//   console.log("Deploying contracts with account:", deployer.address);

//   // Example: Deploying a contract
//   const Token = await ethers.getContractFactory("YourToken"); // Replace with your contract name
//   const token = await Token.deploy();
//   console.log("Token deployed to:", token.address);

//   console.log("Deploying UI to Vercel...");

//   exec("vercel --prod", (deployError, deployStdout, deployStderr) => {
//     if (deployError) {
//       console.error(`Deploy error: ${deployError.message}`);
//       process.exit(1);
//     }
//     console.log(`Deploy stdout: ${deployStdout}`);
//     if (deployStderr) {
//       console.error(`Deploy stderr: ${deployStderr}`);
//     }
//     console.log("UI deployed successfully!");
//   });
// });