import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    chilizSpicy: {
      url: process.env.CHILIZ_RPC_URL || "https://spicy-rpc.chiliz.com",
      chainId: 88882,
      accounts: process.env.CHILIZ_DEPLOYER_PRIVATE_KEY ? [process.env.CHILIZ_DEPLOYER_PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 gwei
    },
    hardhat: {
      chainId: 1337,
    },
  },
  etherscan: {
    apiKey: {
      chilizSpicy: "no-api-key-needed", // Chiliz doesn't require API key for verification
    },
    customChains: [
      {
        network: "chilizSpicy",
        chainId: 88882,
        urls: {
          apiURL: "https://testnet.chiliscan.com/api",
          browserURL: "https://testnet.chiliscan.com",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
