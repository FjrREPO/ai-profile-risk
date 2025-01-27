import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useBalance } from "@/hooks/wallet/useBalance";
import { Button } from '@heroui/button';

const buttonBaseStyles = "rounded-full hover:rounded-full";

const ChainIcon = ({ iconUrl, name, background, size = 20 }: {
  iconUrl?: string;
  name?: string;
  background?: string;
  size?: number;
}) => (
  <div
    style={{
      background,
      width: size,
      height: size,
      borderRadius: 999,
      overflow: 'hidden',
      marginRight: 4,
    }}
  >
    {iconUrl && (
      <img
        alt={`${name ?? 'Chain'} icon`}
        src={iconUrl}
        style={{ width: size, height: size }}
      />
    )}
  </div>
);

const GradientButton = ({ children, onClick, variant = 'bordered' }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'bordered' | 'ghost';
}) => (
  <div className="w-fit flex">
    <Button
      onPress={onClick}
      variant={variant}
      className={`${buttonBaseStyles} flex gap-1 items-center text-sm w-auto h-auto py-2 px-3 border-1 border-gray-600 min-w-0`}
    >
      {children}
    </Button>
  </div>
);

export function ButtonConnectWallet({ setIsMenuOpen }: { setIsMenuOpen?: (isOpen: boolean) => void }) {
  return <ConnectButtonWalletComponents setIsMenuOpen={setIsMenuOpen}/>;
}

export const ConnectButtonWalletComponents = ({ setIsMenuOpen }: { setIsMenuOpen?: (isOpen: boolean) => void }) => {
  const { balances, error } = useBalance();

  const handleCloseMenu = () => {
    if (setIsMenuOpen) {
      setIsMenuOpen(false)
    }
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        if (!mounted) {
          return (
            <div
              aria-hidden="true"
              style={{
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
          );
        }

        const connected = account && chain;

        if (!connected) {
          return (
            <GradientButton onClick={() => { openConnectModal(); handleCloseMenu(); }} variant="ghost">
              Connect Wallet
            </GradientButton>
          );
        }

        if (chain?.unsupported) {
          return (
            <GradientButton onClick={() => { openChainModal(); handleCloseMenu(); }}>
              Wrong network
            </GradientButton>
          );
        }

        return (
          <div className="w-fit flex-wrap flex gap-3 z-50">
            <GradientButton onClick={handleCloseMenu}>
              {chain.hasIcon && (
                <ChainIcon
                  iconUrl={chain.iconUrl}
                  name={chain.name}
                  background={chain.iconBackground}
                  size={15}
                />
              )}
              {error ? (
                'Error loading balance'
              ) : (
                balances ? (balances.native.balance.toString()) : '0'
              )}
            </GradientButton>

            <GradientButton onClick={() => { openChainModal(); handleCloseMenu(); }}>
              {chain.hasIcon && (
                <ChainIcon
                  iconUrl={chain.iconUrl}
                  name={chain.name}
                  background={chain.iconBackground}
                />
              )}
              {chain.name}
            </GradientButton>

            <GradientButton onClick={() => { openAccountModal(); handleCloseMenu(); }}>
              {account.displayName}
              {account.displayBalance && ` (${account.displayBalance})`}
            </GradientButton>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
