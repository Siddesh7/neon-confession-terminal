import CyberButton from "@/components/CyberButton";
import TerminalInput from "@/components/TerminalInput";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-confessions";
import { sendConfession } from "@/lib/confession-utils";
import { toast } from "react-hot-toast";

const Send = () => {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast: uiToast } = useToast();
  const { isConnected, walletClient } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("📝 Confession submission started");
    console.log("📝 Form data:", {
      recipient: recipient,
      messageLength: message.length,
      isAnonymous: isAnonymous,
      walletConnected: isConnected,
    });

    if (!message.trim()) {
      console.log("❌ Validation failed: Empty message");
      uiToast({
        title: "ERROR",
        description: "Message cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Character limit validation for uint256 compatibility
    if (message.length > 32) {
      console.log(
        `❌ Validation failed: Message too long (${message.length}/32 characters)`
      );
      uiToast({
        title: "MESSAGE TOO LONG",
        description: `Message must be 32 characters or less for FHE encryption. Current: ${message.length} characters.`,
        variant: "destructive",
      });
      return;
    }

    if (!isConnected || !walletClient) {
      console.log("❌ Validation failed: Wallet not connected");
      uiToast({
        title: "WALLET NOT CONNECTED",
        description: "Please connect your wallet to send confessions",
        variant: "destructive",
      });
      return;
    }

    // If no recipient is specified, we can't send
    if (!recipient.trim()) {
      console.log("❌ Validation failed: No recipient specified");
      uiToast({
        title: "RECIPIENT REQUIRED",
        description: "Please specify a recipient address",
        variant: "destructive",
      });
      return;
    }

    // Basic address validation
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      console.log("❌ Validation failed: Invalid address format");
      uiToast({
        title: "INVALID ADDRESS",
        description: "Please enter a valid Ethereum address",
        variant: "destructive",
      });
      return;
    }

    console.log(
      "✅ All validations passed - proceeding with confession submission"
    );
    setIsLoading(true);

    try {
      toast.loading("Encrypting confession with FHE...", {
        id: "confession-send",
      });

      console.log("🚀 Calling sendConfession function with parameters:", {
        recipientAddress: recipient,
        messageLength: message.length,
        isAnonymous: isAnonymous,
        senderAddress: walletClient.account?.address,
      });

      const result = await sendConfession({
        recipientAddress: recipient,
        confessionText: message,
        isAnonymous,
        walletClient,
      });

      console.log("✅ Confession sent successfully!");
      console.log("✅ Result:", result);

      toast.success(
        `Confession transmitted! TX: ${result.transactionHash.slice(0, 10)}...`,
        { id: "confession-send" }
      );

      uiToast({
        title: "TRANSMISSION SENT",
        description: `Your ${isAnonymous ? "anonymous" : "identified"} confession has been encrypted and transmitted to the blockchain.`,
      });

      console.log("🔄 Resetting form after successful submission");
      // Reset form
      setRecipient("");
      setMessage("");
    } catch (error) {
      console.error("❌ Failed to send confession:", error);
      toast.error("Failed to transmit confession to the void", {
        id: "confession-send",
      });

      uiToast({
        title: "TRANSMISSION FAILED",
        description:
          "Failed to encrypt and send your confession. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ConnectWalletButton = () => (
    <div className="text-center space-y-4">
      <div className="text-neon-cyan mono-text">WALLET CONNECTION REQUIRED</div>
      <p className="text-sm text-muted-foreground">
        Connect your Web3 wallet to send encrypted confessions
      </p>
      <CyberButton
        variant="primary"
        size="lg"
        onClick={() => {
          // For now, show a message about wallet connection
          uiToast({
            title: "CONNECT WALLET",
            description:
              "Please use the Wallet tab to connect your Web3 wallet first.",
          });
        }}
      >
        CONNECT WALLET
      </CyberButton>
    </div>
  );

  if (!isConnected) {
    return (
      <div className="min-h-screen pb-20 pt-6">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-4xl font-orbitron font-bold text-neon-cyan mb-2 neon-glow glitch-effect"
              data-text="SEND CONFESSION"
            >
              SEND CONFESSION
            </h1>
            <p className="text-neon-pink mono-text">
              // TRANSMIT YOUR THOUGHTS TO THE MATRIX
            </p>
          </div>

          <div className="bg-card-vaporwave p-8 rounded-lg border-2 border-neon-cyan/30 cyber-grid crt-scanlines">
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-6">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-orbitron font-bold text-neon-cyan mb-2 neon-glow glitch-effect"
            data-text="SEND CONFESSION"
          >
            SEND CONFESSION
          </h1>
          <p className="text-neon-pink mono-text">
            // TRANSMIT YOUR THOUGHTS TO THE MATRIX
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card-vaporwave p-6 rounded-lg border-2 border-neon-cyan/30 cyber-grid crt-scanlines">
            <TerminalInput
              label="RECIPIENT ADDRESS (REQUIRED)"
              placeholder="0x742d35Cc6C4F1d2c5dA4F2e1bE7a9C8E3f4D5A6B"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            />

            <div className="mt-6">
              <label className="block text-sm font-orbitron text-neon-cyan uppercase tracking-wider mb-2">
                CONFESSION MESSAGE
              </label>
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your deepest, darkest digital secrets..."
                  rows={6}
                  maxLength={32}
                  className="w-full px-4 py-3 bg-background/80 border-2 border-neon-purple/30 rounded-lg
                           text-foreground font-mono placeholder:text-muted-foreground resize-none
                           focus:border-neon-purple focus:outline-none focus:ring-0
                           focus:shadow-lg focus:shadow-neon-purple/30
                           transition-all duration-300 crt-scanlines
                           hover:border-neon-purple/50"
                  required
                />
                <div
                  className={`absolute bottom-2 right-3 text-xs mono-text transition-colors ${
                    message.length > 30
                      ? "text-neon-pink"
                      : message.length > 25
                        ? "text-neon-yellow"
                        : "text-muted-foreground"
                  }`}
                >
                  {message.length}/32
                </div>
              </div>
              <div className="mt-1 text-xs text-muted-foreground mono-text">
                Maximum 32 characters for FHE uint256 encryption compatibility
              </div>
            </div>

            {/* Options */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-neon-pink/20">
                <div>
                  <div className="font-orbitron text-neon-pink text-sm">
                    ANONYMOUS MODE
                  </div>
                  <div className="text-xs text-muted-foreground mono-text">
                    Hide your identity from the matrix
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-12 h-6 rounded-full border-2 transition-all duration-300 relative ${
                    isAnonymous
                      ? "border-neon-pink bg-neon-pink/20"
                      : "border-neon-cyan/50 bg-background/20"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-all duration-300 absolute top-0.5 ${
                      isAnonymous
                        ? "left-6 bg-neon-pink"
                        : "left-0.5 bg-neon-cyan/50"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-neon-purple/20">
                <div>
                  <div className="font-orbitron text-neon-purple text-sm">
                    FHE ENCRYPTION
                  </div>
                  <div className="text-xs text-muted-foreground mono-text">
                    Military-grade homomorphic encryption (Always enabled)
                  </div>
                </div>
                <div className="w-12 h-6 rounded-full border-2 border-neon-purple bg-neon-purple/20 relative">
                  <div className="w-4 h-4 rounded-full bg-neon-purple absolute top-0.5 left-6" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <CyberButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading
                  ? "ENCRYPTING & TRANSMITTING..."
                  : "TRANSMIT TO VOID"}
              </CyberButton>
            </div>
          </div>
        </form>

        {/* Status Display */}
        <div className="mt-6 p-4 bg-card-vaporwave rounded-lg border border-neon-cyan/30">
          <div className="mono-text text-sm space-y-1">
            <div className="text-neon-cyan">
              STATUS: {isLoading ? "TRANSMITTING" : "READY_FOR_TRANSMISSION"}
            </div>
            <div className="text-neon-pink">
              MODE: {isAnonymous ? "ANONYMOUS" : "IDENTIFIED"}
            </div>
            <div className="text-neon-purple">ENCRYPTION: FHE_ENABLED</div>
            <div className="text-neon-cyan">BLOCKCHAIN: BASE_SEPOLIA</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Send;
