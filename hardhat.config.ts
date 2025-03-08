import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@nomiclabs/hardhat-ethers'
import "@nomiclabs/hardhat-etherscan";
import 'hardhat-contract-sizer';
import dotenv from 'dotenv';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
//const PROD_PRIVATE_KEY = process.env.PROD_PRIVATE_KEY;
const ALCHEMY_KEY_BASE_SEPOLIA = process.env.ALCHEMY_KEY_BASE_SEPOLIA;
//const ALCHEMY_KEY_BASE_MAINNET = process.env.ALCHEMY_KEY_BASE_MAINNET;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
        {
            version: "0.8.26",
            settings: {
                metadata: {
                    bytecodeHash: "none",
                },
                optimizer: {
                    enabled: true,
                    runs: 1337,
                },
            },
        },
    ],
    settings: {
        outputSelection: {
            "*": {
                "*": ["storageLayout"],
            },
        },
    },
  },

  paths: {
    artifacts: "build/artifacts",
    cache: "build/cache",
    sources: "contracts",
  },

  networks: {

    localhost: {
      url:' http://127.0.0.1:8545/'
    },
    basetestnet: {
      url: `https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY_BASE_SEPOLIA}`,
      chainId: 84532,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    storytestnet: {
      url: `https://aeneid.storyrpc.io`,
      chainId: 1315,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    /*
    base: {
      url: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY_BASE_MAINNET}`,
      chainId: 8453,
      accounts: [`0x${PROD_PRIVATE_KEY}`]
    }
    
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_MAINNET_KEY}`,
      accounts: [`0x${PROD_PRIVATE_KEY}`]
    }*/
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    //apiKey: process.env.MAINNET_ETHERSCAN_API_KEY
    
    apiKey: {
      basetestnet: process.env.BASE_SEPOLIA_API_KEY,
      base: process.env.BASE_MAINNET_API_KEY,
      storytestnet: process.env.STORY_TESTNET_API_KEY
    },
    customChains: [
      {
        network: "base",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      },
      {
        network: "basetestnet",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.base.org"
        }
      },
      {
        network: "storytestnet",
        chainId: 1315,
        urls: {
          apiURL: "https://aeneid.storyscan.xyz/api",
          browserURL: "https://aeneid.storyscan.xyz"
        }
      },
    ]
  },
  mocha: {
    timeout: 200000
  }
};

export default config;
