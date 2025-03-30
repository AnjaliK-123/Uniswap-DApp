// hardhat.config.js
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.10",
  networks: {
    goerli: {
      url: "https://eth-sepolia.g.alchemy.com/v2/_ATuUJ9BzFa1DcoauIOZ0Lt154BHszW9",
      accounts: ["5bc601a8522562224cc7774845d1c85ece458d9c91dab20a24827063dddd2f88"],
    }
  },
};
