import BottomNavigation from "@/components/BottomNavigation";
import Feed from "./Feed";
import Send from "./Send";
import Inbox from "./Inbox";
import Wallet from "./Wallet";
import { useState } from "react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("feed");

  const renderContent = () => {
    switch (activeTab) {
      case "feed":
        return <Feed />;
      case "send":
        return <Send />;
      case "inbox":
        return <Inbox />;
      case "wallet":
        return <Wallet />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Header */}
      <div className="text-center py-6 border-b border-neon-pink/20">
        <h1 className="text-3xl font-orbitron font-bold gradient-vaporwave bg-clip-text text-transparent mb-2 neon-glow">
          PRIVATE CONFESSION BOOTH
        </h1>
        <p className="text-neon-cyan mono-text text-sm">
          // ANONYMOUS DIGITAL SANCTUARY v2.077
        </p>
      </div>

      {/* Content */}
      <main className="relative">{renderContent()}</main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
