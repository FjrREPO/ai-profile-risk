import { useEffect } from 'react';
import { useCoinbaseWallet } from "@/hooks/wallet/useCoinbaseWallet";
import { useBalance } from "@/hooks/wallet/useBalance";
import { Button } from "@heroui/button";
import {
  AlertTriangle,
  PowerOff
} from "lucide-react";
import { Dropdown, DropdownItem, DropdownTrigger, DropdownMenu } from "@heroui/dropdown";

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

const NetworkSelectionCard = ({
  error,
  currentChainId,
  supportedNetworks,
  onNetworkSwitch
}: {
  error: NetworkError;
  currentChainId: string;
  supportedNetworks: Record<string, any>;
  onNetworkSwitch: (chainId: "1" | "5" | "137") => Promise<void>;
}) => {
  const currentNetwork = supportedNetworks[currentChainId] || { name: "Unknown" };

  return (
    <Dropdown size='sm' className='text-xs py-1 px-3'>
      <DropdownTrigger>
        <div className="text-xs py-1 px-3 bg-transparent border-2 border-default rounded-full relative inline-flex items-center justify-center cursor-pointer">
          {error?.message ? (
            <div className="flex items-center text-red-500">
              <AlertTriangle className="mr-1 h-4 w-4" />
              {error.message}
            </div>
          ) : (
            currentNetwork.name
          )}
        </div>
      </DropdownTrigger>
      <DropdownMenu>
        {Object.keys(supportedNetworks).map((key) => (
          <DropdownItem
            key={key}
            onPress={() => onNetworkSwitch(key as "1" | "5" | "137")}
            className={`
                ${currentChainId?.toString() === key
                ? 'bg-default font-semibold'
                : 'hover:bg-default/50'}
              `}
          >
            {supportedNetworks[key].name}
          </DropdownItem>
        ))}
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