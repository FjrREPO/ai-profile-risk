import { SUPPORTED_NETWORKS } from '@/lib/constants';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';

type SupportedNetworks = typeof SUPPORTED_NETWORKS;
type ChainId = keyof SupportedNetworks;

interface WalletState {
  address: string | null;
  chainId: ChainId | null;
  isConnecting: boolean;
  error: Error | null;
}

const APP_NAME = "Your App Name";
const APP_LOGO_URL = "https://your-app-logo.com/logo.png";

const coinbaseWallet = createCoinbaseWalletSDK({
  appName: APP_NAME,
  appLogoUrl: APP_LOGO_URL
});

export function useWallet() {
  const [state, setState] = useState<WalletState & { isConnected: boolean }>({
    address: null,
    chainId: null,
    isConnecting: false,
    error: null,
    isConnected: false
  });

  useEffect(() => {
    const provider = coinbaseWallet.getProvider();

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setState({
          address: null,
          chainId: null,
          isConnecting: false,
          error: null,
          isConnected: false
        });
      } else {
        setState(prev => ({
          ...prev,
          address: (accounts as string[])[0],
          isConnected: true
        }));
      }
    };

    const handleChainChanged = (chainId: string) => {
      const normalizedChainId = parseInt(chainId as string).toString() as ChainId;
      setState(prev => ({
        ...prev,
        chainId: normalizedChainId
      }));
    };

    const handleDisconnect = () => {
      window.coinbaseWalletExtension?.disconnect();
      setState({
        address: null,
        chainId: null,
        isConnecting: false,
        error: null,
        isConnected: false
      });
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);
    provider.on('disconnect', handleDisconnect);

    provider.request({ method: 'eth_accounts' })
      .then((accounts) => {
        if ((accounts as string[]).length > 0) {
          provider.request({ method: 'eth_chainId' })
            .then((chainId) => {
              chainId = chainId as string;
              const normalizedChainId = parseInt(chainId as string).toString() as ChainId;
              setState(prev => ({
                ...prev,
                address: (accounts as string[])[0],
                chainId: normalizedChainId,
                isConnected: true
              }));
            });
        }
      });

    return () => {
      provider.removeListener('accountsChanged', handleAccountsChanged);
      provider.removeListener('chainChanged', handleChainChanged);
      provider.removeListener('disconnect', handleDisconnect);
    };
  }, []);

  const connect = useCallback(async (preferredChainId: ChainId = "1") => {
    try {
      setState(prev => ({ ...prev, isConnecting: true, error: null }));

      const network = SUPPORTED_NETWORKS[preferredChainId];
      const provider = coinbaseWallet.getProvider();

      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: network.chainId,
          chainName: network.name,
          rpcUrls: [network.rpcUrl]
        }]
      });

      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      }) as string[];

      const chainId = await provider.request({ method: 'eth_chainId' });
      const normalizedChainId = parseInt(chainId as string).toString() as ChainId;

      setState(prev => ({
        ...prev,
        address: accounts[0],
        chainId: normalizedChainId,
        isConnecting: false,
        isConnected: true
      }));

      return provider;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error,
        isConnecting: false,
        isConnected: false
      }));
      throw error;
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      const provider = coinbaseWallet.getProvider();

      await provider.disconnect();

      setState({
        address: null,
        chainId: null,
        isConnecting: false,
        error: null,
        isConnected: false
      });

      localStorage.removeItem('walletlink:https://www.walletlink.org:version');
      localStorage.removeItem('walletlink:https://www.walletlink.org:session:id');
      localStorage.removeItem('walletlink:https://www.walletlink.org:session:secret');
      localStorage.removeItem('walletlink:https://www.walletlink.org:session:linked');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as Error
      }));
      throw error;
    }
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    provider: coinbaseWallet.getProvider()
  };
}

export function useNetworkSwitch(provider: any) {
  const switchNetwork = useCallback(async (chainId: ChainId) => {
    if (!provider) {
      throw new Error('Provider not initialized');
    }

    const network = SUPPORTED_NETWORKS[chainId];

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }]
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: network.chainId,
              chainName: network.name,
              rpcUrls: [network.rpcUrl]
            }]
          });
        } catch (addError) {
          throw addError;
        }
      }
      throw error;
    }
  }, [provider]);

  return { switchNetwork };
}

export function useSupportedNetworks() {
  const networks = useMemo(() => {
    return Object.entries(SUPPORTED_NETWORKS).map(([id, network]) => ({
      id,
      ...network
    }));
  }, []);

  return { networks };
}