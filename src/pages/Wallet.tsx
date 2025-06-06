
import CyberButton from "@/components/CyberButton";
import { Wallet as WalletIcon, Zap, Shield, Globe } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Wallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("0.00");
  const { toast } = useToast();

  const handleConnect = () => {
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true);
      setWalletAddress("0x742d35Cc6C4F1d2c5dA4F2e1bE7a9C8E3f4D5A6B");
      setBalance("2.47");
      toast({
        title: "WALLET CONNECTED",
        description: "Successfully linked to the cyber grid."
      });
    }, 1500);

    toast({
      title: "CONNECTING...",
      description: "Establishing secure connection to the blockchain."
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress("");
    setBalance("0.00");
    toast({
      title: "WALLET DISCONNECTED",
      description: "Connection to cyber grid terminated."
    });
  };

  return (
    <div className="min-h-screen pb-20 pt-6">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron font-bold text-neon-cyan mb-2 neon-glow glitch-effect" data-text="CYBER WALLET">
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
                Connect your Web3 wallet to access premium features and tip other users in the confession matrix.
              </p>

              <CyberButton
                variant="secondary"
                size="lg"
                onClick={handleConnect}
                className="w-full mb-6"
              >
                CONNECT WALLET
              </CyberButton>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-background/40 rounded-lg border border-neon-pink/20">
                  <Zap className="w-8 h-8 text-neon-pink mx-auto mb-2" />
                  <div className="text-sm font-orbitron text-neon-pink">INSTANT TIPS</div>
                  <div className="text-xs text-muted-foreground mono-text">
                    Reward confessions you love
                  </div>
                </div>
                
                <div className="p-4 bg-background/40 rounded-lg border border-neon-purple/20">
                  <Shield className="w-8 h-8 text-neon-purple mx-auto mb-2" />
                  <div className="text-sm font-orbitron text-neon-purple">PREMIUM ENCRYPTION</div>
                  <div className="text-xs text-muted-foreground mono-text">
                    Military-grade message security
                  </div>
                </div>
                
                <div className="p-4 bg-background/40 rounded-lg border border-neon-cyan/20">
                  <Globe className="w-8 h-8 text-neon-cyan mx-auto mb-2" />
                  <div className="text-sm font-orbitron text-neon-cyan">GLOBAL ACCESS</div>
                  <div className="text-xs text-muted-foreground mono-text">
                    Decentralized and censorship-resistant
                  </div>
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
                  <div className="mono-text text-neon-pink break-all">
                    {walletAddress}
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
                  {balance} ETH
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <CyberButton variant="primary" size="lg" className="h-16">
                <div className="text-center">
                  <div className="text-sm">SEND</div>
                  <div className="text-xs opacity-70">Transfer crypto</div>
                </div>
              </CyberButton>
              
              <CyberButton variant="secondary" size="lg" className="h-16">
                <div className="text-center">
                  <div className="text-sm">RECEIVE</div>
                  <div className="text-xs opacity-70">Get QR code</div>
                </div>
              </CyberButton>
            </div>

            {/* Transaction History */}
            <div className="bg-card-vaporwave p-6 rounded-lg border border-neon-cyan/30">
              <h3 className="text-lg font-orbitron text-neon-cyan mb-4">
                RECENT TRANSACTIONS
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-background/40 rounded-lg">
                  <div>
                    <div className="text-sm text-neon-pink">Tip sent</div>
                    <div className="text-xs text-muted-foreground mono-text">To: confession #42</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-neon-pink">-0.01 ETH</div>
                    <div className="text-xs text-muted-foreground mono-text">2h ago</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-background/40 rounded-lg">
                  <div>
                    <div className="text-sm text-neon-cyan">Tip received</div>
                    <div className="text-xs text-muted-foreground mono-text">From: anonymous</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-neon-cyan">+0.05 ETH</div>
                    <div className="text-xs text-muted-foreground mono-text">1d ago</div>
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
