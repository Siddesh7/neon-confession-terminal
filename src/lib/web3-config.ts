import { createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { injected, walletConnect } from "@wagmi/connectors";
import { CHAIN_CONFIG } from "@/constants";

const projectId = "your-wallet-connect-project-id"; // You can get this from WalletConnect

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [injected(), walletConnect({ projectId })],
  transports: {
    [baseSepolia.id]: http(CHAIN_CONFIG.baseSepolia.rpcUrl),
  },
});

export { baseSepolia };
