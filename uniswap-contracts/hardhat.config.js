const tenderly = require("@tenderly/hardhat-tenderly");
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.10",
  networks: {
    virtual_sepolia: {
      url: "https://virtual.sepolia.rpc.tenderly.co/c53d9f7f-22af-4504-b21d-befad728c9d3",
      accounts: ["5bc601a8522562224cc7774845d1c85ece458d9c91dab20a24827063dddd2f88"],
      chainId: 11155111,
      currency: "VETH"
    },
  },
  tenderly: {
    // https://docs.tenderly.co/account/projects/account-project-slug
    project: "project",
    username: "neu",
  },
};
