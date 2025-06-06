import { Heart, Send, Wallet, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({
  activeTab,
  onTabChange,
}: BottomNavigationProps) => {
  const tabs = [
    { id: "feed", icon: Heart, label: "Feed" },
    { id: "send", icon: Send, label: "Send" },
    { id: "inbox", icon: Eye, label: "Inbox" },
    { id: "wallet", icon: Wallet, label: "Wallet" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-card-vaporwave border-t-2 border-neon-pink/30 cyber-grid">
        <div className="flex justify-around items-center py-2 px-4">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg",
                "transition-all duration-300 min-w-0 flex-1",
                "font-orbitron text-xs uppercase tracking-wider",
                activeTab === id
                  ? "text-neon-pink bg-neon-pink/20 border border-neon-pink/50 neon-glow"
                  : "text-neon-cyan/70 hover:text-neon-cyan hover:bg-neon-cyan/10"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 mb-1",
                  activeTab === id && "animate-glow-pulse"
                )}
              />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
