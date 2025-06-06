import CyberButton from "@/components/CyberButton";
import {
  Wallet as WalletIcon,
  Zap,
  Shield,
  Globe,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useConnect, useDisconnect, useAccount, useBalance } from "wagmi";
import { injected } from "@wagmi/connectors";
import { toast } from "react-hot-toast";
import { CHAIN_CONFIG } from "@/constants";

const Wallet = () => {
  const { toast: uiToast } = useToast();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  const handleConnect = () => {
    try {
      connect({ connector: injected() });
      toast.loading("Connecting to Web3 wallet...", { id: "wallet-connect" });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet", { id: "wallet-connect" });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success("Wallet disconnected", { id: "wallet-disconnect" });
    uiToast({
      title: "WALLET DISCONNECTED",
      description: "Connection to cyber grid terminated.",
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal: any) => {
    if (!bal) return "0.00";
    return parseFloat(bal.formatted).toFixed(4);
  };

  return (
    <div className="min-h-screen pb-20 pt-6">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-orbitron font-bold text-neon-cyan mb-2 neon-glow glitch-effect"
            data-text="CYBER WALLET"
          >
            CYBER WALLET
          </h1>
          <p className="text-neon-pink mono-text">
            // CONNECT TO THE DECENTRALIZED MATRIX
          </p>
        </div>

        {!isConnected ? (
          /* Connection Interface */
          <div className="space-y-6">
            <div className="bg-card-vaporwave p-8 rounded-lg border-2 border-neon-cyan/30 cyber-grid crt-scanlines text-center">
              <div className="w-24 h-24 mx-auto mb-6 border-2 border-neon-cyan rounded-full flex items-center justify-center">
                <WalletIcon className="w-12 h-12 text-neon-cyan" />
              </div>

              <h2 className="text-2xl font-orbitron text-neon-cyan mb-4">
                WALLET NOT CONNECTED
              </h2>

              <p className="text-muted-foreground mono-text mb-8">
                Connect your Web3 wallet to access premium features and send
                encrypted confessions on Base Sepolia.
              </p>

              <CyberButton
                variant="secondary"
                size="lg"
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full mb-6"
              >
                {isConnecting ? "CONNECTING..." : "CONNECT WALLET"}
              </CyberButton>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-background/40 rounded-lg border border-neon-pink/20">
                  <Zap className="w-8 h-8 text-neon-pink mx-auto mb-2" />
                  <div className="text-sm font-orbitron text-neon-pink">
                    FHE ENCRYPTION
                  </div>
                  <div className="text-xs text-muted-foreground mono-text">
                    Fully homomorphic encryption
                  </div>
                </div>

                <div className="p-4 bg-background/40 rounded-lg border border-neon-purple/20">
                  <Shield className="w-8 h-8 text-neon-purple mx-auto mb-2" />
                  <div className="text-sm font-orbitron text-neon-purple">
                    PRIVATE CONFESSIONS
                  </div>
                  <div className="text-xs text-muted-foreground mono-text">
                    End-to-end encrypted messages
                  </div>
                </div>

                <div className="p-4 bg-background/40 rounded-lg border border-neon-cyan/20">
                  <Globe className="w-8 h-8 text-neon-cyan mx-auto mb-2" />
                  <div className="text-sm font-orbitron text-neon-cyan">
                    BASE SEPOLIA
                  </div>
                  <div className="text-xs text-muted-foreground mono-text">
                    Decentralized and censorship-resistant
                  </div>
                </div>
              </div>
            </div>

            {/* Network Info */}
            <div className="bg-card-vaporwave p-4 rounded-lg border border-neon-purple/30">
              <h3 className="text-lg font-orbitron text-neon-purple mb-3">
                NETWORK REQUIREMENTS
              </h3>
              <div className="space-y-2 text-sm mono-text">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network:</span>
                  <span className="text-neon-cyan">Base Sepolia Testnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chain ID:</span>
                  <span className="text-neon-cyan">
                    {CHAIN_CONFIG.baseSepolia.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RPC URL:</span>
                  <span className="text-neon-cyan text-xs">
                    {CHAIN_CONFIG.baseSepolia.rpcUrl}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Connected Interface */
          <div className="space-y-6">
            {/* Wallet Info */}
            <div className="bg-card-vaporwave p-6 rounded-lg border-2 border-neon-pink/30 cyber-grid crt-scanlines">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm font-orbitron text-neon-cyan uppercase tracking-wider">
                    WALLET ADDRESS
                  </div>
                  <div className="mono-text text-neon-pink break-all flex items-center gap-2">
                    {formatAddress(address || "")}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(address || "");
                        toast.success("Address copied to clipboard");
                      }}
                      className="text-neon-cyan hover:text-neon-pink transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="w-12 h-12 border-2 border-neon-pink rounded-full flex items-center justify-center">
                  <WalletIcon className="w-6 h-6 text-neon-pink" />
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm font-orbitron text-neon-purple uppercase tracking-wider mb-2">
                  BALANCE
                </div>
                <div className="text-4xl font-orbitron text-neon-purple neon-glow">
                  {formatBalance(balance)} ETH
                </div>
                <div className="text-xs text-muted-foreground mono-text mt-1">
                  Base Sepolia Testnet
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <CyberButton
                variant="primary"
                size="lg"
                className="h-16"
                onClick={() => {
                  window.open(
                    `${CHAIN_CONFIG.baseSepolia.blockExplorer}/address/${address}`,
                    "_blank"
                  );
                }}
              >
                <div className="text-center">
                  <div className="text-sm">VIEW ON EXPLORER</div>
                  <div className="text-xs opacity-70">Check transactions</div>
                </div>
              </CyberButton>

              <CyberButton
                variant="secondary"
                size="lg"
                className="h-16"
                onClick={() => {
                  uiToast({
                    title: "GET TEST ETH",
                    description:
                      "Visit the Base Sepolia faucet to get test ETH for gas fees.",
                  });
                  window.open(
                    "https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet",
                    "_blank"
                  );
                }}
              >
                <div className="text-center">
                  <div className="text-sm">GET TEST ETH</div>
                  <div className="text-xs opacity-70">From faucet</div>
                </div>
              </CyberButton>
            </div>

            {/* Network Status */}
            <div className="bg-card-vaporwave p-6 rounded-lg border border-neon-cyan/30">
              <h3 className="text-lg font-orbitron text-neon-cyan mb-4">
                NETWORK STATUS
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-background/40 rounded-lg">
                  <div>
                    <div className="text-sm text-neon-cyan">
                      Connection Status
                    </div>
                    <div className="text-xs text-muted-foreground mono-text">
                      Wallet connected to Base Sepolia
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-neon-cyan">CONNECTED</div>
                    <div className="text-xs text-muted-foreground mono-text">
                      Ready for transactions
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-background/40 rounded-lg">
                  <div>
                    <div className="text-sm text-neon-purple">FHE Status</div>
                    <div className="text-xs text-muted-foreground mono-text">
                      Inco encryption enabled
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-neon-purple">ACTIVE</div>
                    <div className="text-xs text-muted-foreground mono-text">
                      Ready for encryption
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Disconnect Button */}
            <CyberButton
              variant="danger"
              size="md"
              onClick={handleDisconnect}
              className="w-full"
            >
              DISCONNECT WALLET
            </CyberButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
