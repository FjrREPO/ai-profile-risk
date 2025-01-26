import { useCallback, useState } from "react";
import { createCoinbaseWalletSDK } from "@coinbase/wallet-sdk";

const APP_NAME = "CoinConnect";

const SUPPORTED_NETWORKS = {
  "1": { 
    name: "Ethereum Mainnet", 
    chainId: "0x1", 
    rpcUrl: `https://mainnet.infura.io/v3/${import.meta.env.VITE_WALLETCONNECT_PROJECT_ID}` 
  },
  "5": { 
    name: "Goerli Testnet", 
    chainId: "0x5", 
    rpcUrl: `https://mainnet.infura.io/v3/${import.meta.env.VITE_WALLETCONNECT_PROJECT_ID}` 
  },
  "137": { 
    name: "Polygon Mainnet", 
    chainId: "0x89", 
    rpcUrl: "https://polygon-rpc.com" 
  }
} as const;

interface NetworkInfo {
  name: string;
  chainId: string;
  rpcUrl: string;
}

interface CoinbaseWalletHook {
  connect: () => Promise<void>;
  disconnect: () => void;
  address: string | null;
  isConnected: boolean;
  error: Error | null;
  chainId: number | null;
  switchNetwork: (networkKey: keyof typeof SUPPORTED_NETWORKS) => Promise<void>;
  supportedNetworks: Record<string, NetworkInfo>;
}

export function useCoinbaseWallet(): CoinbaseWalletHook {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [supportedNetworks] = useState(SUPPORTED_NETWORKS);

  const connect = useCallback(async () => {
    try {
      setError(null);
      
      const coinbaseWallet = createCoinbaseWalletSDK({
        appName: APP_NAME,
        appLogoUrl: undefined,
      });

      const ethereum = coinbaseWallet.getProvider();
      
      if (!ethereum) {
        throw new Error("Coinbase Wallet provider not available");
      }

      const accounts: string[] = await ethereum.request({ method: "eth_requestAccounts" }) as string[];

      if (!accounts) {
        throw new Error("No Ethereum accounts found");
      }

      setAddress(accounts[0]);
      setIsConnected(true);

      const currentChainId = await ethereum.request({
        method: "eth_chainId",
      }) as string;

      if (currentChainId) {
        setChainId(parseInt(currentChainId, 16));
      }
    } catch (err) {
      const processedError = err instanceof Error 
        ? err 
        : new Error("Unexpected error during wallet connection");
      
      console.error("Wallet Connection Error:", processedError);
      
      setError(processedError);
      setIsConnected(false);
      setAddress(null);
      setChainId(null);
    }
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setAddress(null);
    setError(null);
    setChainId(null);
  }, []);

  const switchNetwork = useCallback(async (networkKey: keyof typeof SUPPORTED_NETWORKS) => {
    try {
      const network = supportedNetworks[networkKey];
      
      if (!network) {
        throw new Error("Unsupported network selected");
      }

      const coinbaseWallet = createCoinbaseWalletSDK({
        appName: APP_NAME,
        appLogoUrl: undefined,
      });

      const ethereum = coinbaseWallet.getProvider();

      if (!ethereum) {
        throw new Error("Ethereum provider unavailable");
      }

      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.chainId }],
      });

      setChainId(parseInt(network.chainId, 16));
      setError(null);
    } catch (err) {
      const processedError = err instanceof Error 
        ? err 
        : new Error("Network switching failed");
      
      console.error("Network Switch Error:", processedError);
      setError(processedError);
    }
  }, [supportedNetworks]);

  return {
    connect,
    disconnect,
    address,
    isConnected,
    error,
    chainId,
    switchNetwork,
    supportedNetworks,
  };
}