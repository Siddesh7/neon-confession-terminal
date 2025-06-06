
import ConfessionCard from "@/components/ConfessionCard";
import { useEffect, useState } from "react";

interface Confession {
  id: string;
  content: string;
  timestamp: string;
  likes: number;
  isAnonymous: boolean;
  isEncrypted: boolean;
}

const Feed = () => {
  const [confessions, setConfessions] = useState<Confession[]>([]);

  useEffect(() => {
    // Mock data for demonstration
    const mockConfessions: Confession[] = [
      {
        id: "conf_001",
        content: "I still use Internet Explorer in 2024... Don't judge me, it makes me feel nostalgic for the good old days of dial-up and waiting 5 minutes for a single webpage to load.",
        timestamp: "2H AGO",
        likes: 42,
        isAnonymous: true,
        isEncrypted: false
      },
      {
        id: "conf_002",
        content: "Sometimes I pretend I'm a cyberpunk hacker when I'm just writing CSS. The neon lights on my keyboard help with the illusion.",
        timestamp: "4H AGO",
        likes: 127,
        isAnonymous: true,
        isEncrypted: false
      },
      {
        id: "conf_003",
        content: "I have a secret crush on my AI assistant. Is that weird? They always know exactly what to say...",
        timestamp: "6H AGO",
        likes: 89,
        isAnonymous: false,
        isEncrypted: true
      },
      {
        id: "conf_004",
        content: "I collect vintage keyboards from the 80s and pretend they're from the future. My apartment looks like a museum of retro-futurism.",
        timestamp: "8H AGO",
        likes: 234,
        isAnonymous: true,
        isEncrypted: false
      },
      {
        id: "conf_005",
        content: "Every night I dream in neon colors. I wake up disappointed that reality doesn't have RGB lighting built-in.",
        timestamp: "12H AGO",
        likes: 156,
        isAnonymous: true,
        isEncrypted: false
      }
    ];

    setConfessions(mockConfessions);
  }, []);

  return (
    <div className="min-h-screen pb-20 pt-6">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron font-bold text-neon-pink mb-2 neon-glow glitch-effect" data-text="CONFESSION FEED">
            CONFESSION FEED
          </h1>
          <p className="text-neon-cyan mono-text">
            // ANONYMOUS THOUGHTS FROM THE DIGITAL VOID
          </p>
        </div>

        {/* Confessions Feed */}
        <div className="space-y-6">
          {confessions.map((confession) => (
            <ConfessionCard
              key={confession.id}
              id={confession.id}
              content={confession.content}
              timestamp={confession.timestamp}
              likes={confession.likes}
              isAnonymous={confession.isAnonymous}
              isEncrypted={confession.isEncrypted}
            />
          ))}
        </div>

        {/* Load more indicator */}
        <div className="text-center mt-8">
          <div className="text-neon-cyan mono-text animate-pulse">
            LOADING MORE CONFESSIONS...
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
