import { useCallback, useState, useEffect } from "react";
import { createCoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import { SUPPORTED_NETWORKS } from "@/lib/constants";

const APP_NAME = "CoinConnect";
const STORAGE_KEY = "wallet_connection_status";

interface NetworkInfo {
  name: string;
  chainId: string;
  rpcUrl: string;
}

interface CoinbaseWalletHook {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
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

  // Create a stable reference to the wallet instance
  const getCoinbaseWallet = useCallback(() => {
    return createCoinbaseWalletSDK({
      appName: APP_NAME,
      appLogoUrl: undefined,
    });
  }, []);

  const resetWalletState = useCallback(() => {
    setIsConnected(false);
    setAddress(null);
    setError(null);
    setChainId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Updated connection check with better error handling
  const checkConnection = useCallback(async () => {
    try {
      const ethereum = getCoinbaseWallet().getProvider();
      if (!ethereum) {
        throw new Error("Coinbase Wallet provider not available");
      }

      const accounts = (await ethereum.request({
        method: "eth_accounts",
      })) as string[];

      const isActive = accounts && accounts.length > 0;
      
      if (isActive) {
        setAddress(accounts[0]);
        setIsConnected(true);
        localStorage.setItem(STORAGE_KEY, accounts[0]);

        const currentChainId = (await ethereum.request({
          method: "eth_chainId",
        })) as string;

        setChainId(parseInt(currentChainId, 16));
      } else {
        resetWalletState();
      }

      return isActive;
    } catch (err) {
      console.error("Error checking connection:", err);
      resetWalletState();
      return false;
    }
  }, [getCoinbaseWallet, resetWalletState]);

  // Initialize wallet and set up listeners
  useEffect(() => {
    const ethereum = getCoinbaseWallet().getProvider();
    
    if (!ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        await disconnect();
      } else {
        await checkConnection();
      }
    };

    const handleChainChanged = (newChainId: string) => {
      setChainId(parseInt(newChainId, 16));
    };

    const handleDisconnect = async () => {
      await disconnect();
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);
    ethereum.on("disconnect", handleDisconnect);

    // Check initial connection status
    checkConnection();

    return () => {
      if (ethereum) {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
        ethereum.removeListener("disconnect", handleDisconnect);
      }
    };
  }, [getCoinbaseWallet, checkConnection]);

  const connect = useCallback(async () => {
    try {
      setError(null);
      const ethereum = getCoinbaseWallet().getProvider();

      if (!ethereum) {
        throw new Error("Coinbase Wallet provider not available");
      }

      const accounts = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error("No Ethereum accounts found");
      }

      await checkConnection();
    } catch (err) {
      const processedError =
        err instanceof Error ? err : new Error("Unexpected error during wallet connection");
      console.error("Wallet Connection Error:", processedError);
      resetWalletState();
      setError(processedError);
    }
  }, [getCoinbaseWallet, checkConnection, resetWalletState]);

  const disconnect = useCallback(async () => {
    try {
      const ethereum = getCoinbaseWallet().getProvider();

      if (ethereum) {
        // Clear wallet permissions
        await ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });

        // Attempt to disconnect if the method exists
        if (typeof ethereum.disconnect === "function") {
          await ethereum.disconnect();
        }

        // Force clear the accounts
        await ethereum.request({
          method: "eth_accounts",
        });
      }
    } catch (err) {
      console.error("Error during wallet disconnection:", err);
    } finally {
      resetWalletState();
    }
  }, [getCoinbaseWallet, resetWalletState]);

  const switchNetwork = useCallback(
    async (networkKey: keyof typeof SUPPORTED_NETWORKS) => {
      try {
        const network = supportedNetworks[networkKey];
        if (!network) {
          throw new Error("Unsupported network selected");
        }

        const ethereum = getCoinbaseWallet().getProvider();
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
        const processedError =
          err instanceof Error ? err : new Error("Network switching failed");
        console.error("Network Switch Error:", processedError);
        setError(processedError);
      }
    },
    [supportedNetworks, getCoinbaseWallet]
  );

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