import { useEffect } from 'react';
import { useCoinbaseWallet } from "@/hooks/wallet/useCoinbaseWallet";
import { useBalance } from "@/hooks/wallet/useBalance";
import { Button } from "@heroui/button";
import {
  AlertTriangle,
  PowerOff
} from "lucide-react";
import { Dropdown, DropdownItem, DropdownTrigger, DropdownMenu } from "@heroui/dropdown";
import { NetworkIcon } from '@web3icons/react'

const formatAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}${"*".repeat(8)}${address.slice(-4)}`;
};

const formatBalance = (balance: string, decimals: number = 4): string => {
  return parseFloat(balance).toFixed(decimals);
};

const WalletConnectButton = ({ onConnect }: { onConnect: () => void }) => {
  return (
    <Button
      variant='bordered'
      onPress={onConnect}
      className="hover:bg-default/30 min-w-3 rounded-full px-3 text-xs"
    >
      Connect Wallet
    </Button>
  );
};

const WalletAddressCard = ({ address, balance }: { address: string; balance: string }) => {
  return (
    <div className="text-xs py-1 px-3 bg-transparent border-2 border-default rounded-full relative inline-flex items-center justify-center">
      {`${formatBalance(balance)}`}{" | "}{formatAddress(address)}
    </div>
  );
};

interface NetworkError {
  message?: string;
}

const NetworkIcons = {
  "1": () => (
    <NetworkIcon network="ethereum" variant="branded" />
  ),
  "137": () => (
    <NetworkIcon network="polygon" variant="branded" />
  ),
  "42161": () => (
    <NetworkIcon network="arbitrum-one" variant="branded" />
  ),
  "43114": () => (
    <NetworkIcon network="avalanche" variant="branded" />
  ),
  "8453": () => (
    <NetworkIcon network="base" variant="branded" />
  ),
  "56": () => (
    <NetworkIcon network="binance-smart-chain" variant="branded" />
  ),
  "10": () => (
    <NetworkIcon network="optimism" variant="branded" />
  )
};

const NetworkSelectionCard = ({
  error,
  currentChainId,
  supportedNetworks,
  onNetworkSwitch
}: {
  error: NetworkError;
  currentChainId: string;
  supportedNetworks: Record<string, any>;
  onNetworkSwitch: (chainId: "1" | "137" | "42161" | "43114" | "8453" | "56" | "10") => Promise<void>;
}) => {
  const currentNetwork = supportedNetworks[currentChainId] || { name: "Unknown" };
  const CurrentNetworkIcon = NetworkIcons[currentChainId as keyof typeof NetworkIcons];

  return (
    <Dropdown size='sm' className='text-xs py-1 px-3'>
      <DropdownTrigger>
        <div className="text-xs py-1 px-3 bg-transparent border-2 border-default rounded-full relative inline-flex items-center justify-center cursor-pointer gap-2">
          {error?.message ? (
            <div className="flex items-center text-red-500">
              <AlertTriangle className="mr-1 h-4 w-4" />
              Network Not Supported
            </div>
          ) : (
            <div className='flex flex-row items-center gap-3'>
              {CurrentNetworkIcon && <CurrentNetworkIcon />}
              {currentNetwork.name}
            </div>
          )}
        </div>
      </DropdownTrigger>
      <DropdownMenu>
        {Object.keys(supportedNetworks)
          .sort((a, b) => supportedNetworks[a].name.localeCompare(supportedNetworks[b].name))
          .map((key) => {
            const NetworkIcon = NetworkIcons[key as keyof typeof NetworkIcons];
            return (
              <DropdownItem
                key={key}
                onPress={() => onNetworkSwitch(key as "1" | "137" | "42161" | "43114" | "8453" | "56" | "10")}
                className={`
                  flex flex-row items-center
                  ${currentChainId?.toString() === key
                    ? 'bg-default font-semibold'
                    : 'hover:bg-default/50'}
                `}
              >
                <div className='flex items-center gap-3'>
                  {NetworkIcon && <NetworkIcon />}
                  {supportedNetworks[key].name}
                </div>
              </DropdownItem>
            );
          })}
      </DropdownMenu>
    </Dropdown>
  );
};

export default function WalletManagementDashboard() {
  const {
    connect,
    disconnect,
    address,
    isConnected,
    error,
    chainId,
    switchNetwork,
    supportedNetworks
  } = useCoinbaseWallet();

  const {
    fetchBalances,
    balances
  } = useBalance();

  useEffect(() => {
    if (isConnected && address) {
      fetchBalances(address);
    }
  }, [isConnected, address, fetchBalances]);

  if (!isConnected) {
    return (
      <div className="flex justify-center items-center h-full">
        <WalletConnectButton onConnect={connect} />
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-2">
      <NetworkSelectionCard
        error={error || {}}
        currentChainId={chainId?.toString() || ""}
        supportedNetworks={supportedNetworks}
        onNetworkSwitch={switchNetwork}
      />
      <WalletAddressCard
        address={address || ""}
        balance={balances.native.balance}
      />
      <Button
        variant="bordered"
        onPress={disconnect}
        className="text-red-500 hover:bg-default/30 min-w-3 rounded-full px-3"
      >
        <PowerOff className="h-4 w-4" />
      </Button>
    </div>
  );
}