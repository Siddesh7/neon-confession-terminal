import ConfessionCard from "@/components/ConfessionCard";
import { usePublicFeed } from "@/hooks/use-confessions";
import { formatDistanceToNow } from "date-fns";

const Feed = () => {
  const { publicConfessions, loading, refetch } = usePublicFeed();

  console.log("📺 Feed component rendered");
  console.log("📺 Feed state:", {
    publicConfessionsCount: publicConfessions.length,
    loading: loading,
  });

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return formatDistanceToNow(date, { addSuffix: true }).toUpperCase();
  };

  const handleRefresh = () => {
    console.log("🔄 Manual refresh button clicked on Feed page");
    refetch();
  };

  if (loading) {
    console.log("📺 Feed is loading - showing loading message");
    return (
      <div className="min-h-screen pb-20 pt-6">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-4xl font-orbitron font-bold text-neon-pink mb-2 neon-glow glitch-effect"
              data-text="PUBLIC CONFESSION FEED"
            >
              PUBLIC CONFESSION FEED
            </h1>
            <p className="text-neon-cyan mono-text">
              // SHARED THOUGHTS FROM THE DIGITAL CONSCIOUSNESS
            </p>
          </div>

          {/* Loading state */}
          <div className="text-center">
            <div className="text-neon-cyan mono-text animate-pulse">
              LOADING PUBLIC CONFESSIONS FROM THE BLOCKCHAIN...
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log("📺 Feed loaded - rendering public confessions");

  return (
    <div className="min-h-screen pb-20 pt-6">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-orbitron font-bold text-neon-pink mb-2 neon-glow glitch-effect"
            data-text="PUBLIC CONFESSION FEED"
          >
            PUBLIC CONFESSION FEED
          </h1>
          <p className="text-neon-cyan mono-text">
            // SHARED THOUGHTS FROM THE DIGITAL CONSCIOUSNESS
          </p>
          <button
            onClick={handleRefresh}
            className="mt-2 text-xs text-neon-purple mono-text hover:text-neon-cyan transition-colors"
          >
            [REFRESH FEED]
          </button>
        </div>

        {/* Public Confessions Stats */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-pink/30 bg-card-vaporwave">
            <span className="text-sm text-muted-foreground mono-text">
              {publicConfessions.length} public confession
              {publicConfessions.length !== 1 ? "s" : ""} in the stream
            </span>
          </div>
        </div>

        {/* Public Confessions Feed */}
        {publicConfessions.length > 0 ? (
          <div className="space-y-6">
            {publicConfessions.map((confession, index) => {
              console.log(
                `📺 Rendering public confession ${index + 1}/${publicConfessions.length}:`,
                {
                  id: confession.confessionId.toString(),
                  likes: confession.likes.toString(),
                  isAnonymous:
                    confession.sender ===
                    "0x0000000000000000000000000000000000000000",
                }
              );

              return (
                <ConfessionCard
                  key={`public-${confession.confessionId}-${index}`}
                  id={confession.confessionId.toString()}
                  content={confession.content}
                  timestamp={formatTimestamp(confession.timestamp)}
                  likes={Number(confession.likes)}
                  isAnonymous={
                    confession.sender ===
                    "0x0000000000000000000000000000000000000000"
                  }
                  isEncrypted={false} // Public confessions are already decrypted
                  sender={confession.sender}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👻</div>
            <h2 className="text-2xl font-orbitron text-neon-cyan mb-4">
              THE VOID ECHOES
            </h2>
            <p className="text-muted-foreground mono-text mb-4">
              No public confessions yet. The digital consciousness awaits your
              thoughts.
            </p>
            <p className="text-sm text-neon-purple mono-text">
              Visit your Inbox to decrypt and share your private confessions
              with the world.
            </p>
          </div>
        )}

        {/* Load more indicator - only show if we have confessions */}
        {publicConfessions.length > 0 && (
          <div className="text-center mt-8">
            <div className="text-neon-cyan mono-text animate-pulse">
              END OF CURRENT TRANSMISSION STREAM
            </div>
            <div className="text-xs text-muted-foreground mono-text mt-2">
              New public confessions will appear automatically
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
