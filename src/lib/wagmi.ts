import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
    arbitrum,
    base,
    mainnet,
    optimism,
    polygon,
    sepolia,
    holesky
} from 'wagmi/chains';
import { coinbaseWallet, metaMaskWallet, okxWallet, rabbyWallet, rainbowWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';

const connectors = connectorsForWallets(
    [
        {
            groupName: 'Suggested',
            wallets: [
                rainbowWallet,
                okxWallet,
                rabbyWallet,
                metaMaskWallet,
                coinbaseWallet,
                walletConnectWallet,
            ],
        },
    ],
    { appName: 'RainbowKit App', projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID }
);

export const config = createConfig({
    connectors,
    chains: [base, mainnet],
    ssr: true,
    transports: {
        [mainnet.id]: http("https://eth-mainnet.g.alchemy.com/v2/vwDTCZX0XZnU6flxj8YzYZuMaOKI3EX9"),
        [base.id]: http("https://base-mainnet.g.alchemy.com/v2/vwDTCZX0XZnU6flxj8YzYZuMaOKI3EX9"),
        [arbitrum.id]: http("https://arb-mainnet.g.alchemy.com/v2/vwDTCZX0XZnU6flxj8YzYZuMaOKI3EX9"),
        [optimism.id]: http("https://opt-mainnet.g.alchemy.com/v2/vwDTCZX0XZnU6flxj8YzYZuMaOKI3EX9"),
        [polygon.id]: http("https://polygon-mainnet.g.alchemy.com/v2/vwDTCZX0XZnU6flxj8YzYZuMaOKI3EX9"),
        [sepolia.id]: http("https://avax-mainnet.g.alchemy.com/v2/vwDTCZX0XZnU6flxj8YzYZuMaOKI3EX9"),
        [holesky.id]: http("https://bnb-mainnet.g.alchemy.com/v2/vwDTCZX0XZnU6flxj8YzYZuMaOKI3EX9"),
    },
});