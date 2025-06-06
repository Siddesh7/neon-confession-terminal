import { useState, useEffect } from "react";
import { useAccount, useWalletClient } from "wagmi";
import {
  getUserReceivedConfessions,
  getUserSentConfessions,
  getPublicConfessionsFeed,
  getConfession,
  type Confession,
  type PublicConfession,
} from "@/lib/confession-utils";
import { toast } from "react-hot-toast";

export function useUserConfessions() {
  const { address } = useAccount();
  const [receivedConfessions, setReceivedConfessions] = useState<Confession[]>(
    []
  );
  const [sentConfessions, setSentConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      console.log("👤 No wallet address - clearing confessions");
      setReceivedConfessions([]);
      setSentConfessions([]);
      setLoading(false);
      return;
    }

    async function fetchConfessions() {
      try {
        console.log("🔄 Starting confession fetch process for user:", address);
        setLoading(true);

        // Get received confession IDs
        console.log("📥 Step 1: Fetching received confession IDs...");
        const receivedIds = await getUserReceivedConfessions(address);

        // Get sent confession IDs
        console.log("📤 Step 2: Fetching sent confession IDs...");
        const sentIds = await getUserSentConfessions(address);

        // Fetch detailed info for each confession
        console.log("📋 Step 3: Fetching detailed confession data...");
        console.log(
          `📋 Processing ${receivedIds.length} received confessions...`
        );

        const receivedDetails = await Promise.all(
          receivedIds.map((id, index) => {
            console.log(
              `📋 Fetching received confession ${index + 1}/${receivedIds.length} (ID: ${id})`
            );
            return getConfession(Number(id));
          })
        );

        console.log(`📋 Processing ${sentIds.length} sent confessions...`);
        const sentDetails = await Promise.all(
          sentIds.map((id, index) => {
            console.log(
              `📋 Fetching sent confession ${index + 1}/${sentIds.length} (ID: ${id})`
            );
            return getConfession(Number(id));
          })
        );

        console.log("✅ Confession fetch completed successfully!");
        console.log(`✅ Received confessions: ${receivedDetails.length}`);
        console.log(`✅ Sent confessions: ${sentDetails.length}`);

        setReceivedConfessions(receivedDetails);
        setSentConfessions(sentDetails);
      } catch (error) {
        console.error("❌ Failed to fetch confessions:", error);
        toast.error("Failed to fetch confessions");
      } finally {
        setLoading(false);
      }
    }

    fetchConfessions();
  }, [address]);

  return { receivedConfessions, sentConfessions, loading };
}

export function usePublicFeed() {
  const [publicConfessions, setPublicConfessions] = useState<
    PublicConfession[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPublicFeed() {
      try {
        console.log("🌐 Fetching public confessions feed...");
        setLoading(true);
        const feed = await getPublicConfessionsFeed();
        console.log(`🌐 Public feed loaded with ${feed.length} confessions`);
        setPublicConfessions(feed);
      } catch (error) {
        console.error("❌ Failed to fetch public feed:", error);
        toast.error("Failed to fetch public feed");
      } finally {
        setLoading(false);
      }
    }

    fetchPublicFeed();

    // Set up polling for new confessions
    console.log("⏰ Setting up 30-second polling for public feed updates");
    const interval = setInterval(() => {
      console.log("🔄 Polling for public feed updates...");
      fetchPublicFeed();
    }, 30000); // Poll every 30s
    return () => {
      console.log("⏰ Cleaning up public feed polling");
      clearInterval(interval);
    };
  }, []);

  const refetch = async () => {
    try {
      console.log("🔄 Manual refetch of public feed requested");
      const feed = await getPublicConfessionsFeed();
      console.log(`🔄 Manual refetch completed - ${feed.length} confessions`);
      setPublicConfessions(feed);
    } catch (error) {
      console.error("❌ Failed to refetch public feed:", error);
      toast.error("Failed to refresh feed");
    }
  };

  return { publicConfessions, loading, refetch };
}

export function useWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const { data: walletClient } = useWalletClient();

  return {
    address,
    isConnected,
    isConnecting,
    walletClient,
  };
}
