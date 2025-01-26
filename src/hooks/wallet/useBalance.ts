import { useCallback, useState } from "react";
import { createCoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import { 
  Contract, 
  formatUnits,
  BrowserProvider 
} from "ethers";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

interface TokenConfig {
  address: string;
  symbol: string;
  decimals: number;
}

interface BalanceInfo {
  native: {
    balance: string;
    symbol: string;
    decimals: number;
  };
  tokens: Array<{
    address: string;
    symbol: string;
    balance: string;
    decimals: number;
  }>;
}

export function useBalance() {
  const [balances, setBalances] = useState<BalanceInfo>({
    native: { balance: "0", symbol: "ETH", decimals: 18 },
    tokens: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBalances = useCallback(async (
    address: string, 
    tokenConfigs: TokenConfig[] = []
  ) => {
    if (!address) {
      throw new Error("Wallet address is required");
    }

    setIsLoading(true);
    setError(null);

    try {
      const coinbaseWallet = createCoinbaseWalletSDK({
        appName: "CoinConnect",
        appLogoUrl: undefined
      });

      const web3Provider = coinbaseWallet.getProvider();
      const provider = new BrowserProvider(web3Provider);  // Use BrowserProvider instead of Web3Provider

      const nativeBalance = await provider.getBalance(address);
      const formattedNativeBalance = formatUnits(nativeBalance, 18);

      const tokenBalances = await Promise.all(
        tokenConfigs.map(async (token) => {
          try {
            const tokenContract = new Contract(
              token.address, 
              ERC20_ABI, 
              await provider.getSigner()  // Get signer to pass as provider
            );

            const balance = await tokenContract.balanceOf(address);
            const formattedBalance = formatUnits(
              balance, 
              token.decimals
            );

            return {
              address: token.address,
              symbol: token.symbol,
              balance: formattedBalance,
              decimals: token.decimals
            };
          } catch (tokenError) {
            console.warn(`Failed to fetch balance for ${token.symbol}:`, tokenError);
            return null;
          }
        })
      );

      const successfulTokenBalances = tokenBalances.filter(
        (balance): balance is NonNullable<typeof balance> => balance !== null
      );

      const balanceData = {
        native: {
          balance: formattedNativeBalance,
          symbol: "ETH",
          decimals: 18
        },
        tokens: successfulTokenBalances
      };

      setBalances(balanceData);
      setIsLoading(false);
      
      return balanceData;

    } catch (err) {
      const processedError = err instanceof Error 
        ? err 
        : new Error("Unexpected error retrieving balances");
      
      console.error("Balance Retrieval Error:", processedError);
      setError(processedError);
      setIsLoading(false);
      throw processedError;
    }
  }, []);

  return {
    fetchBalances,
    balances,
    isLoading,
    error
  };
}

export const EXAMPLE_TOKENS: TokenConfig[] = [
  {
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // Uniswap
    symbol: "UNI",
    decimals: 18
  },
  {
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
    symbol: "DAI", 
    decimals: 18
  }
];