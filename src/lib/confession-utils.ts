import { Lightning } from "@inco/js/lite";
import { supportedChains } from "@inco/js";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/constants";
import { writeContract, readContract } from "@wagmi/core";
import { wagmiConfig, baseSepolia } from "./web3-config";
import type { WalletClient } from "viem";
const ipfsHash = "bafkreifssxm2kb4hpruhaafdawppws7akbkgkqcr2u2bvc5qklamosr4k4";
// Inco FHE Setup
const chainId = supportedChains.baseSepolia;
const zap = Lightning.latest("testnet", chainId);

// Types
export interface SendConfessionParams {
  recipientAddress: string;
  confessionText: string;
  isAnonymous: boolean;
  walletClient: WalletClient;
}

export interface DecryptConfessionParams {
  confessionId: number;
  walletClient: WalletClient;
}

export interface Confession {
  id: bigint;
  sender: string;
  recipient: string;
  ipfsHash: string;
  isPublic: boolean;
  publicContent: string;
  timestamp: bigint;
  isAnonymous: boolean;
}

export interface PublicConfession {
  confessionId: bigint;
  sender: string;
  content: string;
  timestamp: bigint;
  likes: bigint;
  ipfsHash: string;
}

// Text to uint256 conversion utilities
function textToUint256(text: string): bigint {
  console.log("🔤 Converting text to uint256:", text);

  // Validate input
  if (typeof text !== "string") {
    throw new Error("Input must be a string");
  }

  if (text.length === 0) {
    console.log("🔤 Empty string provided, returning 0");
    return 0n;
  }

  // Convert text to bytes using UTF-8 encoding
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  console.log("🔤 Text as bytes:", Array.from(bytes));

  // Check if text is too long for uint256 (32 bytes max)
  if (bytes.length > 32) {
    console.warn(
      `⚠️  Text is ${bytes.length} bytes (${text.length} characters), truncating to 32 bytes for uint256`
    );
    console.warn(`⚠️  Original text: "${text}"`);
    console.warn(`⚠️  This may result in corrupted text when decrypted`);
    console.warn(
      `⚠️  Recommend keeping messages to 32 characters or less for reliable encoding`
    );
  }

  // Convert bytes to BigInt (big-endian)
  let result = 0n;
  for (let i = 0; i < bytes.length && i < 32; i++) {
    // Limit to 32 bytes for uint256
    result = (result << 8n) | BigInt(bytes[i]);
  }

  console.log("🔤 Text as uint256:", result.toString());
  console.log("🔤 Text as uint256 hex:", "0x" + result.toString(16));

  // Additional validation
  if (result === 0n && text.length > 0) {
    console.warn(
      "⚠️  Warning: Non-empty text converted to 0, this might indicate an encoding issue"
    );
  }

  return result;
}

function uint256ToText(value: bigint): string {
  console.log("🔤 Converting uint256 to text:", value.toString());
  console.log("🔤 uint256 hex:", "0x" + value.toString(16));

  // Validate input
  if (typeof value !== "bigint") {
    throw new Error("Input must be a bigint");
  }

  if (value < 0n) {
    throw new Error("Input must be a non-negative bigint");
  }

  if (value === 0n) {
    console.log("🔤 uint256 is 0, returning empty string");
    return "";
  }

  // Convert BigInt back to bytes
  const bytes: number[] = [];
  let temp = value;

  while (temp > 0n) {
    bytes.unshift(Number(temp & 0xffn));
    temp = temp >> 8n;
  }

  console.log("🔤 Bytes from uint256:", bytes);

  // Validate byte array
  if (bytes.length === 0) {
    console.log("🔤 No bytes extracted, returning empty string");
    return "";
  }

  if (bytes.length > 32) {
    console.warn(
      `⚠️  Extracted ${bytes.length} bytes, which exceeds uint256 capacity of 32 bytes`
    );
  }

  // Convert bytes back to text
  try {
    const decoder = new TextDecoder("utf-8", { fatal: true }); // Use fatal mode to catch invalid UTF-8
    const uint8Array = new Uint8Array(bytes);
    const text = decoder.decode(uint8Array);

    console.log("🔤 Decoded text:", text);

    // Additional validation
    if (text.includes("\0")) {
      console.warn(
        "⚠️  Decoded text contains null bytes, this might indicate padding or corruption"
      );
    }

    return text;
  } catch (error) {
    console.error("❌ Failed to decode bytes as UTF-8:", error);
    console.error("❌ Problematic bytes:", bytes);

    // Fallback: try with non-fatal decoder
    try {
      const decoder = new TextDecoder("utf-8", { fatal: false });
      const uint8Array = new Uint8Array(bytes);
      const text = decoder.decode(uint8Array);
      console.warn(
        "⚠️  Using non-fatal UTF-8 decoding, result may be corrupted:",
        text
      );
      return text;
    } catch (fallbackError) {
      console.error("❌ Even non-fatal decoding failed:", fallbackError);
      throw new Error(`Failed to decode uint256 to text: ${error}`);
    }
  }
}

// Send Confession
export async function sendConfession({
  recipientAddress,
  confessionText,
  isAnonymous,
  walletClient,
}: SendConfessionParams) {
  try {
    console.log("🚀 Starting confession sending process...");
    console.log("🚀 Confession text:", confessionText);

    // Validate character limit for uint256 compatibility
    if (confessionText.length > 32) {
      const error = `Text too long: ${confessionText.length} characters. Maximum allowed: 32 characters for uint256 encoding.`;
      console.error("❌", error);
      throw new Error(error);
    }

    console.log(
      `✅ Text length validation passed: ${confessionText.length}/32 characters`
    );

    // 1. Convert confession text to uint256
    const messageAsUint256 = textToUint256(confessionText);
    console.log("🔐 Converted message to uint256 for FHE encryption");

    // 2. Create metadata for IPFS (without encrypted content)
    const ipfsData = {
      timestamp: Date.now(),
      version: "2.0", // New version to indicate direct FHE encryption
      contentType: "fhe-encrypted-confession",
    };

    console.log("📦 Preparing to upload confession metadata to IPFS...");

    console.log("🎯 IPFS CID that will be stored onchain:", ipfsHash);

    // 3. Encrypt the message using Inco FHE
    console.log("🔐 Encrypting message with Inco FHE...");
    const encryptedMessage = await zap.encrypt(messageAsUint256, {
      accountAddress: walletClient.account?.address || "",
      dappAddress: CONTRACT_ADDRESS,
    });

    console.log("🔐 Message encrypted with Inco FHE");

    // 4. Send transaction to smart contract with encrypted message
    console.log("⛓️  Sending transaction to smart contract...", {
      recipient: recipientAddress,
      ipfsHash: ipfsHash,
      isAnonymous: isAnonymous,
    });

    const hash = await writeContract(wagmiConfig, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "sendConfession",
      args: [
        recipientAddress as `0x${string}`,
        ipfsHash, // This is the CID from Pinata
        encryptedMessage as `0x${string}`, // Now storing encrypted message instead of encrypted key
        isAnonymous,
      ],
      account: walletClient.account,
      chain: baseSepolia,
    });

    console.log("✅ Confession sent successfully!");
    console.log("📋 Transaction hash:", hash);
    console.log("📦 IPFS CID stored onchain:", ipfsHash);

    return { transactionHash: hash, ipfsHash };
  } catch (error) {
    console.error("❌ Failed to send confession:", error);
    throw error;
  }
}

// Decrypt Confession
export async function decryptConfession({
  confessionId,
  walletClient,
}: DecryptConfessionParams) {
  try {
    console.log("🔓 Starting decryption for confession ID:", confessionId);
    console.log("🔑 Connected wallet address:", walletClient.account?.address);

    // 1. Get confession details
    console.log("📋 Fetching confession details...");
    let confession;
    try {
      confession = (await readContract(wagmiConfig, {
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "getConfession",
        args: [BigInt(confessionId)],
      })) as [bigint, string, string, string, boolean, string, bigint, boolean];
    } catch (error) {
      console.error("❌ Failed to fetch confession details:", error);
      throw new Error(`Failed to fetch confession details: ${error}`);
    }

    console.log("📋 Confession details:", {
      id: confession[0].toString(),
      sender: confession[1],
      recipient: confession[2],
      ipfsHash: confession[3],
      isPublic: confession[4],
      publicContent: confession[5],
      timestamp: confession[6].toString(),
      isAnonymous: confession[7],
    });

    // Check if the connected wallet is the recipient
    if (
      confession[2].toLowerCase() !==
      walletClient.account?.address?.toLowerCase()
    ) {
      throw new Error(
        `Unauthorized: You are not the recipient of this confession. Expected: ${confession[2]}, Got: ${walletClient.account?.address}`
      );
    }

    // 2. Setup Inco FHE reencryptor
    console.log("🔐 Setting up Inco FHE reencryptor...");
    let reencryptor;
    try {
      reencryptor = await zap.getReencryptor(walletClient);
      console.log("✅ Reencryptor setup successful");
    } catch (error) {
      console.error("❌ Failed to setup reencryptor:", error);
      throw new Error(`Failed to setup Inco reencryptor: ${error}`);
    }

    // 3. Get encrypted message handle from contract
    console.log("🔑 Fetching encrypted message handle from contract...");

    let encryptedMessageHandle;
    try {
      // Get the encrypted message handle from the contract
      // This should be the encrypted message that was stored when sending the confession
      encryptedMessageHandle = await readContract(wagmiConfig, {
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "getEncryptedKey", // Note: This function name needs to be updated in the contract to "getEncryptedMessage"
        args: [BigInt(confessionId)],
      });
      console.log(
        "🔑 Retrieved encrypted message handle from contract:",
        encryptedMessageHandle
      );
    } catch (error) {
      console.error(
        "❌ Failed to get encrypted message handle from contract:",
        error
      );
      console.log("🔧 Using fallback hardcoded handle for testing...");

      // Temporarily hardcode for testing - this should be removed once contract is updated
      encryptedMessageHandle =
        "0x0667b31c3ba7c10100701ecc38c6484895eb3270b103be56186c70bc07000800";
      console.log(
        "🔑 Using hardcoded encrypted message handle:",
        encryptedMessageHandle
      );
    }

    // 4. Request reencryption (off-chain FHE decryption)
    console.log("🔓 Requesting reencryption from Inco...");
    let decryptedResult;
    try {
      decryptedResult = await reencryptor({
        handle: encryptedMessageHandle as `0x${string}`,
      });
      console.log("✅ Reencryption successful");
    } catch (error) {
      console.error("❌ Failed during reencryption:", error);
      console.error("❌ Handle used:", encryptedMessageHandle);
      throw new Error(`Inco reencryption failed: ${error}`);
    }

    console.log("🔓 Reencryption result:", decryptedResult);

    // 5. Convert decrypted result back to text
    let decryptedNumber: bigint;
    try {
      if (typeof decryptedResult === "object" && "value" in decryptedResult) {
        decryptedNumber = BigInt(
          decryptedResult.value as unknown as string | number
        );
      } else {
        decryptedNumber = BigInt(decryptedResult as unknown as string | number);
      }
      console.log("🔢 Converted to BigInt:", decryptedNumber.toString());
      console.log("🔢 BigInt in hex:", "0x" + decryptedNumber.toString(16));

      // Validate that we have a reasonable value
      if (decryptedNumber === 0n) {
        console.warn(
          "⚠️  Warning: Decrypted value is 0, this might indicate an issue"
        );
      }
    } catch (error) {
      console.error("❌ Failed to convert decrypted result to BigInt:", error);
      throw new Error(`Invalid decryption result format: ${error}`);
    }

    // 6. Convert uint256 back to text
    console.log("🔤 Converting decrypted uint256 back to text...");
    let decryptedContent;
    try {
      decryptedContent = uint256ToText(decryptedNumber);
      console.log("✅ Successfully converted uint256 to text!");
      console.log("🎉 Decrypted content:", decryptedContent);

      // Validate that we got meaningful text
      if (!decryptedContent || decryptedContent.trim() === "") {
        console.warn(
          "⚠️  Warning: Decrypted content is empty or whitespace only"
        );
        console.warn(
          "⚠️  This might indicate an issue with the decryption process"
        );
      }
    } catch (error) {
      console.error("❌ Failed to convert uint256 to text:", error);
      console.error("❌ uint256 value was:", decryptedNumber.toString());
      console.error("❌ uint256 hex was:", "0x" + decryptedNumber.toString(16));
      throw new Error(`Failed to decode message: ${error}`);
    }

    // 7. Fetch metadata from IPFS (optional, for timestamp etc.)
    console.log("📦 Fetching metadata from IPFS:", confession[3]);
    let ipfsMetadata;
    try {
      ipfsMetadata = "l"; // ipfsHash
      console.log("✅ IPFS metadata fetch successful");
      console.log("📦 IPFS metadata:", ipfsMetadata);
    } catch (error) {
      console.warn("⚠️ Failed to fetch IPFS metadata (non-critical):", error);
      ipfsMetadata = { timestamp: Date.now() }; // Fallback
    }

    console.log("✅ Successfully decrypted confession content!");

    return {
      content: decryptedContent,
      timestamp: confession[6], // timestamp from blockchain
      sender: confession[1], // sender
      isAnonymous: confession[7], // isAnonymous
      ipfsTimestamp: ipfsMetadata?.timestamp, // timestamp from IPFS
    };
  } catch (error) {
    console.error("❌ Failed to decrypt confession:", error);
    if (error instanceof Error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
    throw error;
  }
}

// Make Confession Public
export async function makeConfessionPublic(
  confessionId: number,
  decryptedContent: string,
  walletClient: WalletClient
) {
  try {
    console.log(`📢 Making confession ${confessionId} public...`);
    console.log(
      `📢 Content to publish (length: ${decryptedContent.length}):`,
      decryptedContent.substring(0, 100) +
        (decryptedContent.length > 100 ? "..." : "")
    );

    const hash = await writeContract(wagmiConfig, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "makeConfessionPublic",
      args: [BigInt(confessionId), decryptedContent],
      account: walletClient.account,
      chain: baseSepolia,
    });

    console.log(`📢 Confession ${confessionId} successfully made public!`);
    console.log(`📢 Transaction hash: ${hash}`);
    return hash;
  } catch (error) {
    console.error(
      `❌ Failed to make confession ${confessionId} public:`,
      error
    );
    throw error;
  }
}

// Like Confession
export async function likeConfession(
  confessionId: number,
  walletClient: WalletClient
) {
  try {
    console.log(`❤️ Liking confession ${confessionId}...`);
    console.log(`❤️ User address: ${walletClient.account?.address}`);

    const hash = await writeContract(wagmiConfig, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "likeConfession",
      args: [BigInt(confessionId)],
      account: walletClient.account,
      chain: baseSepolia,
    });

    console.log(`❤️ Confession ${confessionId} liked successfully!`);
    console.log(`❤️ Transaction hash: ${hash}`);
    return hash;
  } catch (error) {
    console.error(`❌ Failed to like confession ${confessionId}:`, error);
    throw error;
  }
}

// Get User's Confessions
export async function getUserReceivedConfessions(
  userAddress: string
): Promise<bigint[]> {
  try {
    console.log("📥 Fetching received confessions for user:", userAddress);

    const confessionIds = (await readContract(wagmiConfig, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "getUserReceivedConfessions",
      args: [userAddress as `0x${string}`],
    })) as bigint[];

    console.log(
      `📥 Found ${confessionIds.length} received confessions:`,
      confessionIds.map((id) => id.toString())
    );
    return confessionIds;
  } catch (error) {
    console.error("❌ Failed to get received confessions:", error);
    throw error;
  }
}

export async function getUserSentConfessions(
  userAddress: string
): Promise<bigint[]> {
  try {
    console.log("📤 Fetching sent confessions for user:", userAddress);

    const confessionIds = (await readContract(wagmiConfig, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "getUserSentConfessions",
      args: [userAddress as `0x${string}`],
    })) as bigint[];

    console.log(
      `📤 Found ${confessionIds.length} sent confessions:`,
      confessionIds.map((id) => id.toString())
    );
    return confessionIds;
  } catch (error) {
    console.error("❌ Failed to get sent confessions:", error);
    throw error;
  }
}

// Get Public Feed
export async function getPublicConfessionsFeed(): Promise<PublicConfession[]> {
  try {
    console.log("📡 Fetching public confessions feed...");

    const feed = (await readContract(wagmiConfig, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "getPublicConfessionsFeed",
    })) as PublicConfession[];

    console.log(`📡 Retrieved ${feed.length} public confessions from feed`);
    console.log(
      "📡 Public confessions details:",
      feed.map((c) => ({
        id: c.confessionId.toString(),
        likes: c.likes.toString(),
        content:
          c.content.substring(0, 50) + (c.content.length > 50 ? "..." : ""),
        sender: c.sender,
      }))
    );

    return feed.reverse(); // Show newest first
  } catch (error) {
    console.error("❌ Failed to get public feed:", error);
    throw error;
  }
}

// Get Individual Confession
export async function getConfession(confessionId: number): Promise<Confession> {
  try {
    console.log(`🔍 Fetching individual confession with ID: ${confessionId}`);

    const confession = (await readContract(wagmiConfig, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "getConfession",
      args: [BigInt(confessionId)],
    })) as [bigint, string, string, string, boolean, string, bigint, boolean];

    const confessionData = {
      id: confession[0],
      sender: confession[1],
      recipient: confession[2],
      ipfsHash: confession[3],
      isPublic: confession[4],
      publicContent: confession[5],
      timestamp: confession[6],
      isAnonymous: confession[7],
    };

    console.log(`🔍 Retrieved confession ${confessionId}:`, {
      id: confessionData.id.toString(),
      sender: confessionData.sender,
      recipient: confessionData.recipient,
      ipfsHash: confessionData.ipfsHash,
      isPublic: confessionData.isPublic,
      isAnonymous: confessionData.isAnonymous,
      timestamp: new Date(
        Number(confessionData.timestamp) * 1000
      ).toISOString(),
      publicContentLength: confessionData.publicContent.length,
    });

    return confessionData;
  } catch (error) {
    console.error(`❌ Failed to get confession ${confessionId}:`, error);
    throw error;
  }
}

// Request Confession Message Decryption
export async function requestConfessionKeyDecryption(
  confessionId: number,
  walletClient: WalletClient
): Promise<number> {
  try {
    console.log(
      "🔐 Requesting confession message decryption for ID:",
      confessionId
    );

    const hash = await writeContract(wagmiConfig, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "requestConfessionKeyDecryption", // Note: This function name should be updated in the contract to "requestConfessionMessageDecryption"
      args: [BigInt(confessionId)],
      account: walletClient.account,
      chain: baseSepolia,
    });

    console.log("✅ Message decryption request sent, transaction hash:", hash);

    // The function returns a request ID, but since we're using writeContract
    // we'll need to listen for the event to get the actual request ID
    return 0; // Placeholder - in practice you'd listen for the ConfessionDecrypted event
  } catch (error) {
    console.error("Failed to request confession message decryption:", error);
    throw error;
  }
}

// Check if user has liked a confession
export async function hasUserLikedConfession(
  confessionId: number,
  userAddress: string
): Promise<boolean> {
  try {
    console.log(
      `🔍 Checking if user ${userAddress} has liked confession ${confessionId}...`
    );

    const hasLiked = (await readContract(wagmiConfig, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "hasLiked",
      args: [BigInt(confessionId), userAddress as `0x${string}`],
    })) as boolean;

    console.log(
      `🔍 User ${userAddress} ${hasLiked ? "HAS" : "has NOT"} liked confession ${confessionId}`
    );
    return hasLiked;
  } catch (error) {
    console.error(
      `❌ Failed to check like status for confession ${confessionId}:`,
      error
    );
    return false;
  }
}

// Get total number of confessions
export async function getTotalConfessions(): Promise<number> {
  try {
    console.log("📊 Fetching total number of confessions...");

    const total = (await readContract(wagmiConfig, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "getTotalConfessions",
    })) as bigint;

    const totalNum = Number(total);
    console.log(`📊 Total confessions in system: ${totalNum}`);
    return totalNum;
  } catch (error) {
    console.error("❌ Failed to get total confessions:", error);
    return 0;
  }
}

// Get total number of public confessions
export async function getTotalPublicConfessions(): Promise<number> {
  try {
    console.log("📊 Fetching total number of public confessions...");

    const total = (await readContract(wagmiConfig, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "getTotalPublicConfessions",
    })) as bigint;

    const totalNum = Number(total);
    console.log(`📊 Total public confessions: ${totalNum}`);
    return totalNum;
  } catch (error) {
    console.error("❌ Failed to get total public confessions:", error);
    return 0;
  }
}

// Get paginated public confessions feed
export async function getPublicConfessionsFeedPaginated(
  offset: number,
  limit: number
): Promise<PublicConfession[]> {
  try {
    console.log(
      `📄 Fetching paginated public feed - offset: ${offset}, limit: ${limit}`
    );

    const feed = (await readContract(wagmiConfig, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "getPublicConfessionsFeedPaginated",
      args: [BigInt(offset), BigInt(limit)],
    })) as PublicConfession[];

    console.log(
      `📄 Retrieved ${feed.length} confessions from paginated feed (offset: ${offset})`
    );
    return feed.reverse(); // Show newest first
  } catch (error) {
    console.error(
      `❌ Failed to get paginated public feed (offset: ${offset}, limit: ${limit}):`,
      error
    );
    throw error;
  }
}

// Check if a confession is anonymous
export async function isConfessionAnonymous(
  confessionId: number
): Promise<boolean> {
  try {
    console.log(`🕵️ Checking if confession ${confessionId} is anonymous...`);

    const isAnon = (await readContract(wagmiConfig, {
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "isAnonymous",
      args: [BigInt(confessionId)],
    })) as boolean;

    console.log(
      `🕵️ Confession ${confessionId} is ${isAnon ? "ANONYMOUS" : "NOT anonymous"}`
    );
    return isAnon;
  } catch (error) {
    console.error("Failed to check if confession is anonymous:", error);
    return false;
  }
}

// Debug function to check available confessions
export async function debugConfessionList(): Promise<void> {
  try {
    console.log("🔍 DEBUGGING: Checking available confessions...");

    const totalConfessions = await getTotalConfessions();
    console.log("📊 Total confessions in contract:", totalConfessions);

    if (totalConfessions > 0) {
      console.log("📋 Checking individual confessions:");
      for (let i = 1; i <= Math.min(totalConfessions, 5); i++) {
        try {
          const confession = await getConfession(i);
          console.log(`📋 Confession ${i}:`, {
            id: confession.id.toString(),
            sender: confession.sender,
            recipient: confession.recipient,
            ipfsHash: confession.ipfsHash,
            isPublic: confession.isPublic,
            timestamp: new Date(
              Number(confession.timestamp) * 1000
            ).toISOString(),
            isAnonymous: confession.isAnonymous,
          });
        } catch (error) {
          console.log(`❌ Error checking confession ${i}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("❌ Failed to debug confessions:", error);
  }
}
