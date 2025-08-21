require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ledger");

const { deployContract } = require("./scripts/deploy.js");

require("@nomicfoundation/hardhat-chai-matchers");

task("deployContract", "Deploy contracts with parameter name")
  .addPositionalParam("contractName")
  .addPositionalParam("contractType")
  .setAction(async (args, hre) => {
    const ethers = hre.ethers;
    let contractArgs = [];
    if (args.contractType === "staking") {
    } else if (args.contractType === "token") {
      contractArgs.push(process.env.DEPLOY_ARGS_TOKEN_NAME);
      contractArgs.push(process.env.DEPLOY_ARGS_TOKEN_SYMBOL);
      contractArgs.push(process.env.DEPLOY_ARGS_TOKEN_SUPPLY);
      contractArgs.push(process.env.DEPLOY_ARGS_TOKEN_DECIMAL);
    } else {
      throw new Error("Contract Type must be staking or token.");
    }

    try {
      await deployContract(args.contractName, contractArgs, hre, ethers);
    } catch (ex) {
      console.log(ex);
    }
  });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    testnet: {
      url: `https://arbitrum-sepolia.infura.io/v3/${process.env.INFURA_KEY}`,
      chainId: 421614,
      /*accounts:
        process.env.DEPLOY_PRIVATEKEY !== undefined
          ? [process.env.DEPLOY_PRIVATEKEY.replace("0x", "")]
          : [],*/
      ledgerAccounts: [process.env.DEPLOY_ADDRESS],
    },
    mainnet: {
      url: `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      chainId: 42161,
      /*accounts:
        process.env.DEPLOY_PRIVATEKEY !== undefined
          ? [process.env.DEPLOY_PRIVATEKEY.replace("0x", "")]
          : [],*/
      ledgerAccounts: [process.env.DEPLOY_ADDRESS],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
    customChains: [
      {
        url: `https://arbitrum-sepolia.infura.io/v3/${process.env.INFURA_KEY}`,
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io",
        },
      },
    ],
  },
};
