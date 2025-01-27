export const SUPPORTED_NETWORKS = {
  "42161": {
    name: "Arbitrum One",
    chainId: "0xa4b1",
    rpcUrl: "https://arb-mainnet.g.alchemy.com/v2/vwDTCZX0XZnU6flxj8YzYZuMaOKI3EX9"
  },
  "43114": {
    name: "Avalanche C-Chain",
    chainId: "0xa86a",
    rpcUrl: "https://avax-mainnet.g.alchemy.com/v2/vwDTCZX0XZnU6flxj8YzYZuMaOKI3EX9"
  },
  "8453": {
    name: "Base",
    chainId: "0x2105",
    rpcUrl: "https://base-mainnet.g.alchemy.com/v2/vwDTCZX0XZnU6flxj8YzYZuMaOKI3EX9"
  },
  "56": {
    name: "BNB Smart Chain",
    chainId: "0x38",
    rpcUrl: "https://bnb-mainnet.g.alchemy.com/v2/vwDTCZX0XZnU6flxj8YzYZuMaOKI3EX9"
  },
  "1": {
    name: "Ethereum Mainnet",
    chainId: "0x1",
    rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/vwDTCZX0XZnU6flxj8YzYZuMaOKI3EX9`
  },
  "10": {
    name: "Optimism Mainnet",
    chainId: "0xa",
    rpcUrl: "https://opt-mainnet.g.alchemy.com/v2/vwDTCZX0XZnU6flxj8YzYZuMaOKI3EX9"
  },
  "137": {
    name: "Polygon Mainnet",
    chainId: "0x89",
    rpcUrl: "https://polygon-mainnet.g.alchemy.com/v2/vwDTCZX0XZnU6flxj8YzYZuMaOKI3EX9"
  },
} as const;