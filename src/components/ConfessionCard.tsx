
import { Heart, Lock, Eye } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ConfessionCardProps {
  id: string;
  content: string;
  timestamp: string;
  likes: number;
  isAnonymous: boolean;
  isEncrypted?: boolean;
  className?: string;
}

const ConfessionCard = ({ 
  id, 
  content, 
  timestamp, 
  likes: initialLikes, 
  isAnonymous, 
  isEncrypted = false,
  className 
}: ConfessionCardProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className={cn(
      "bg-card-vaporwave p-4 rounded-lg cyber-grid crt-scanlines relative",
      "border-2 border-neon-pink/30 hover:border-neon-pink/60 transition-all duration-300",
      "group hover:shadow-lg hover:shadow-neon-pink/20",
      className
    )}>
      {/* Glitch overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 to-neon-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="text-xs text-neon-cyan mono-text">
              {isAnonymous ? "ANONYMOUS" : "USER_" + id.slice(0, 6).toUpperCase()}
            </div>
            {isEncrypted && (
              <Lock className="w-3 h-3 text-neon-purple" />
            )}
            {!isEncrypted && (
              <Eye className="w-3 h-3 text-neon-cyan" />
            )}
          </div>
          <div className="text-xs text-muted-foreground mono-text">
            {timestamp}
          </div>
        </div>

        {/* Content */}
        <div className="text-foreground mb-4 leading-relaxed">
          {content}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full",
              "border transition-all duration-300 mono-text text-sm",
              "hover:scale-105 active:scale-95",
              isLiked 
                ? "border-neon-pink text-neon-pink bg-neon-pink/10 animate-glow-pulse" 
                : "border-neon-cyan/50 text-neon-cyan hover:border-neon-cyan hover:bg-neon-cyan/10"
            )}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            <span>{likes}</span>
          </button>

          <div className="text-xs text-neon-purple mono-text">
            ID: {id.slice(0, 8).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfessionCard;
