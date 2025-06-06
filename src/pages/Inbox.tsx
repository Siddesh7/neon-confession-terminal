import ConfessionCard from "@/components/ConfessionCard";
import CyberButton from "@/components/CyberButton";
import { Eye, Share } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserConfessions } from "@/hooks/use-confessions";
import { useAccount, useWalletClient } from "wagmi";
import {
  decryptConfession,
  makeConfessionPublic,
  debugConfessionList,
} from "@/lib/confession-utils";
import { formatDistanceToNow } from "date-fns";
import { toast as hotToast } from "react-hot-toast";

const Inbox = () => {
  const { toast } = useToast();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { receivedConfessions, loading } = useUserConfessions();
  const [decryptingConfessions, setDecryptingConfessions] = useState<
    Set<string>
  >(new Set());
  const [makingPublicConfessions, setMakingPublicConfessions] = useState<
    Set<string>
  >(new Set());
  const [decryptedContents, setDecryptedContents] = useState<
    Map<string, string>
  >(new Map());

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return formatDistanceToNow(date, { addSuffix: true }).toUpperCase();
  };

  const handleDecrypt = async (confessionId: string) => {
    if (!walletClient) {
      console.log("❌ Decryption failed: Wallet not connected");
      hotToast.error("Please connect your wallet first");
      return;
    }

    console.log(`🔓 Starting decryption for confession ${confessionId}`);
    console.log(`🔓 User address: ${walletClient.account?.address}`);

    const confessionIdNum = Number(confessionId);
    setDecryptingConfessions((prev) => new Set(prev).add(confessionId));

    try {
      console.log(`🔓 Calling decryptConfession for ID: ${confessionIdNum}`);

      const decryptedData = await decryptConfession({
        confessionId: confessionIdNum,
        walletClient,
      });

      console.log("✅ Decryption successful!");
      console.log("✅ Decrypted data:", {
        contentLength: decryptedData.content.length,
        timestamp: decryptedData.timestamp,
        sender: decryptedData.sender,
        isAnonymous: decryptedData.isAnonymous,
      });

      setDecryptedContents((prev) => {
        const newMap = new Map(prev);
        newMap.set(confessionId, decryptedData.content);
        return newMap;
      });

      hotToast.success("🔓 Confession decrypted!");
      toast({
        title: "DECRYPTION SUCCESSFUL",
        description: "Message from the void has been decoded.",
      });
    } catch (error) {
      console.error(`❌ Failed to decrypt confession ${confessionId}:`, error);
      hotToast.error("Failed to decrypt confession");
    } finally {
      setDecryptingConfessions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(confessionId);
        return newSet;
      });
    }
  };

  const handleMakePublic = async (confessionId: string) => {
    if (!walletClient) {
      console.log("❌ Publishing failed: Wallet not connected");
      hotToast.error("Please connect your wallet first");
      return;
    }

    // Check if confession is decrypted first
    const decryptedContent = decryptedContents.get(confessionId);
    if (!decryptedContent) {
      console.log(
        `❌ Publishing failed: Confession ${confessionId} not decrypted yet`
      );
      hotToast.error(
        "Please decrypt the confession first before making it public"
      );
      return;
    }

    console.log(
      `📢 Starting publication process for confession ${confessionId}`
    );
    console.log(`📢 Content to publish (length: ${decryptedContent.length})`);
    console.log(`📢 User address: ${walletClient.account?.address}`);

    const confessionIdNum = Number(confessionId);
    setMakingPublicConfessions((prev) => new Set(prev).add(confessionId));

    try {
      console.log(`📢 Calling makeConfessionPublic for ID: ${confessionIdNum}`);

      await makeConfessionPublic(
        confessionIdNum,
        decryptedContent,
        walletClient
      );

      console.log(
        `✅ Confession ${confessionId} successfully published to public feed!`
      );

      hotToast.success("📡 Confession published to public feed!");
      toast({
        title: "PUBLISHED TO FEED",
        description:
          "Message has been shared with the collective consciousness.",
      });
    } catch (error) {
      console.error(
        `❌ Failed to make confession ${confessionId} public:`,
        error
      );
      hotToast.error("Failed to publish confession");
    } finally {
      setMakingPublicConfessions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(confessionId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-20 pt-6">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-4xl font-orbitron font-bold text-neon-purple mb-2 neon-glow glitch-effect"
              data-text="SECURE INBOX"
            >
              SECURE INBOX
            </h1>
            <p className="text-neon-cyan mono-text">
              // ENCRYPTED TRANSMISSIONS FROM THE MATRIX
            </p>
          </div>

          {/* Loading state */}
          <div className="text-center">
            <div className="text-neon-cyan mono-text animate-pulse">
              SCANNING BLOCKCHAIN FOR CONFESSIONS...
            </div>
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
            className="text-4xl font-orbitron font-bold text-neon-purple mb-2 neon-glow glitch-effect"
            data-text="SECURE INBOX"
          >
            SECURE INBOX
          </h1>
          <p className="text-neon-cyan mono-text">
            // ENCRYPTED TRANSMISSIONS FROM THE MATRIX
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card-vaporwave p-4 rounded-lg border border-neon-pink/30 text-center">
            <div className="text-2xl font-orbitron text-neon-pink">
              {receivedConfessions.length}
            </div>
            <div className="text-xs text-muted-foreground mono-text">TOTAL</div>
          </div>
          <div className="bg-card-vaporwave p-4 rounded-lg border border-neon-purple/30 text-center">
            <div className="text-2xl font-orbitron text-neon-purple">
              {
                receivedConfessions.filter(
                  (c) => !c.isPublic && !decryptedContents.has(c.id.toString())
                ).length
              }
            </div>
            <div className="text-xs text-muted-foreground mono-text">
              ENCRYPTED
            </div>
          </div>
          <div className="bg-card-vaporwave p-4 rounded-lg border border-neon-cyan/30 text-center">
            <div className="text-2xl font-orbitron text-neon-cyan">
              {
                receivedConfessions.filter(
                  (c) => c.isPublic || decryptedContents.has(c.id.toString())
                ).length
              }
            </div>
            <div className="text-xs text-muted-foreground mono-text">
              READABLE
            </div>
          </div>
        </div>

        {/* Debug Section */}
        <div className="mb-6 p-4 bg-card-vaporwave rounded-lg border border-neon-yellow/30">
          <div className="text-sm font-orbitron text-neon-yellow mb-2">
            DEBUG TOOLS
          </div>
          <div className="flex gap-3">
            <CyberButton
              variant="secondary"
              size="sm"
              onClick={() => {
                console.log("🔍 Running confession debug analysis...");
                debugConfessionList();
              }}
              className="text-xs"
            >
              DEBUG CONFESSIONS
            </CyberButton>
          </div>
        </div>

        {/* Confessions */}
        <div className="space-y-6">
          {receivedConfessions.map((confession) => {
            const confessionId = confession.id.toString();
            const isDecryptedLocally = decryptedContents.has(confessionId);
            const displayContent = confession.isPublic
              ? confession.publicContent
              : isDecryptedLocally
                ? decryptedContents.get(confessionId)!
                : "***ENCRYPTED*** Click DECRYPT to reveal content";

            return (
              <div key={confessionId} className="space-y-3">
                <ConfessionCard
                  id={confessionId}
                  content={displayContent}
                  timestamp={formatTimestamp(confession.timestamp)}
                  likes={0}
                  isAnonymous={confession.isAnonymous}
                  isEncrypted={!confession.isPublic && !isDecryptedLocally}
                  sender={confession.sender}
                  showDecryptToEveryone={!confession.isPublic}
                  isDecryptedLocally={isDecryptedLocally}
                  onDecryptToEveryone={handleMakePublic}
                  isDecryptingToEveryone={makingPublicConfessions.has(
                    confessionId
                  )}
                />

                {/* Decrypt Action - Only show if confession needs to be decrypted */}
                {!confession.isPublic && !isDecryptedLocally && (
                  <div className="flex justify-center">
                    <CyberButton
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDecrypt(confessionId)}
                      disabled={decryptingConfessions.has(confessionId)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      {decryptingConfessions.has(confessionId)
                        ? "DECRYPTING..."
                        : "DECRYPT TO VIEW"}
                    </CyberButton>
                  </div>
                )}

                {/* Status Indicators */}
                <div className="flex justify-center gap-3">
                  {confession.isPublic && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-neon-cyan/50 text-neon-cyan text-sm mono-text">
                      <Share className="w-4 h-4" />
                      PUBLIC
                    </div>
                  )}

                  {!confession.isPublic && isDecryptedLocally && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-neon-purple/50 text-neon-purple text-sm mono-text">
                      <Eye className="w-4 h-4" />
                      DECRYPTED - READY TO SHARE
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {receivedConfessions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-orbitron text-neon-cyan mb-2">
              INBOX EMPTY
            </h3>
            <p className="text-muted-foreground mono-text mb-4">
              No encrypted transmissions detected in the void.
            </p>
            <div className="text-xs text-neon-purple mono-text">
              Ask someone to send you a confession to see it appear here.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
