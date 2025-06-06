import { Heart, Lock, Eye, Share } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAccount, useWalletClient } from "wagmi";
import { likeConfession, hasUserLikedConfession } from "@/lib/confession-utils";
import { toast } from "react-hot-toast";

interface ConfessionCardProps {
  id: string;
  content: string;
  timestamp: string;
  likes: number;
  isAnonymous: boolean;
  isEncrypted?: boolean;
  sender?: string;
  className?: string;
  showDecryptToEveryone?: boolean;
  isDecryptedLocally?: boolean;
  onDecryptToEveryone?: (confessionId: string) => void;
  isDecryptingToEveryone?: boolean;
}

const ConfessionCard = ({
  id,
  content,
  timestamp,
  likes: initialLikes,
  isAnonymous,
  isEncrypted = false,
  sender,
  className,
  showDecryptToEveryone = false,
  isDecryptedLocally = false,
  onDecryptToEveryone,
  isDecryptingToEveryone = false,
}: ConfessionCardProps) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Check if user has already liked this confession
  useEffect(() => {
    if (address && !isEncrypted) {
      console.log(
        `🔍 Checking like status for confession ${id} and user ${address}`
      );
      hasUserLikedConfession(Number(id), address)
        .then((liked) => {
          console.log(
            `🔍 User ${address} ${liked ? "HAS" : "has NOT"} liked confession ${id}`
          );
          setIsLiked(liked);
        })
        .catch((error) => {
          console.error(
            `❌ Failed to check like status for confession ${id}:`,
            error
          );
          setIsLiked(false);
        });
    }
  }, [id, address, isEncrypted]);

  const handleLike = async () => {
    if (!address || !walletClient) {
      console.log(`❌ Like failed for confession ${id}: Wallet not connected`);
      toast.error("Please connect your wallet first");
      return;
    }

    if (isEncrypted) {
      console.log(
        `❌ Like failed for confession ${id}: Cannot like encrypted confessions`
      );
      toast.error("Cannot like encrypted confessions");
      return;
    }

    if (isLiked) {
      console.log(
        `❌ Like failed for confession ${id}: User already liked this confession`
      );
      toast.error("You have already liked this confession");
      return;
    }

    console.log(`❤️ Starting like process for confession ${id}`);
    console.log(`❤️ User: ${address}`);
    console.log(`❤️ Current likes: ${likes}`);

    setIsLiking(true);
    try {
      console.log(`❤️ Calling likeConfession for ID: ${id}`);
      await likeConfession(Number(id), walletClient);

      console.log(`✅ Successfully liked confession ${id}!`);
      console.log(`✅ Likes updated: ${likes} -> ${likes + 1}`);

      setIsLiked(true);
      setLikes(likes + 1);
      toast.success("Confession liked! 💖");
    } catch (error) {
      console.error(`❌ Failed to like confession ${id}:`, error);
      toast.error("Failed to like confession");
    } finally {
      setIsLiking(false);
    }
  };

  const displaySender = () => {
    if (isAnonymous) return "ANONYMOUS";
    if (sender && sender !== "0x0000000000000000000000000000000000000000") {
      return `${sender.slice(0, 6)}...${sender.slice(-4)}`.toUpperCase();
    }
    return "USER_" + id.slice(0, 6).toUpperCase();
  };

  return (
    <div
      className={cn(
        "bg-card-vaporwave p-4 rounded-lg cyber-grid crt-scanlines relative",
        "border-2 border-neon-pink/30 hover:border-neon-pink/60 transition-all duration-300",
        "group hover:shadow-lg hover:shadow-neon-pink/20",
        className
      )}
    >
      {/* Glitch overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 to-neon-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="text-xs text-neon-cyan mono-text">
              {displaySender()}
            </div>
            {isEncrypted && <Lock className="w-3 h-3 text-neon-purple" />}
            {!isEncrypted && <Eye className="w-3 h-3 text-neon-cyan" />}
          </div>
          <div className="text-xs text-muted-foreground mono-text">
            {timestamp}
          </div>
        </div>

        {/* Content */}
        <div className="text-foreground mb-4 leading-relaxed">{content}</div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              disabled={isLiking || isLiked || isEncrypted}
              className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full",
                "border transition-all duration-300 mono-text text-sm",
                "hover:scale-105 active:scale-95",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isLiked
                  ? "border-neon-pink text-neon-pink bg-neon-pink/10 animate-glow-pulse"
                  : "border-neon-cyan/50 text-neon-cyan hover:border-neon-cyan hover:bg-neon-cyan/10"
              )}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
              <span>{isLiking ? "..." : likes}</span>
            </button>

            {/* Decrypt to Everyone Button */}
            {showDecryptToEveryone &&
              isDecryptedLocally &&
              !isEncrypted &&
              onDecryptToEveryone && (
                <button
                  onClick={() => onDecryptToEveryone(id)}
                  disabled={isDecryptingToEveryone}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-full",
                    "border border-neon-purple/50 text-neon-purple",
                    "hover:border-neon-purple hover:bg-neon-purple/10",
                    "transition-all duration-300 mono-text text-sm",
                    "hover:scale-105 active:scale-95",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  <Share className="w-4 h-4" />
                  <span>
                    {isDecryptingToEveryone ? "PUBLISHING..." : "MAKE PUBLIC"}
                  </span>
                </button>
              )}
          </div>

          <div className="text-xs text-neon-purple mono-text">
            ID: {id.slice(0, 8).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfessionCard;
