// Pinata IPFS Service
import { PINATA_CONFIG, validatePinataConfig } from "./pinata-config";

export interface PinataUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export interface PinataMetadata {
  name?: string;
  keyvalues?: Record<string, string>;
}

/**
 * Upload JSON content to IPFS via Pinata
 */
export async function uploadToIPFS(
  content: any,
  metadata?: PinataMetadata
): Promise<string> {
  // Check if Pinata is properly configured

  try {
    const data = JSON.stringify({
      pinataContent: content,
      pinataMetadata: {
        name: metadata?.name || `confession-${Date.now()}`,
        keyvalues: {
          type: "confession",
          timestamp: new Date().toISOString(),
          ...metadata?.keyvalues,
        },
      },
      pinataOptions: {
        cidVersion: 1,
      },
    });

    console.log("🚀 Uploading confession metadata to Pinata IPFS...", {
      contentSize: data.length,
      metadata: metadata,
    });

    const response = await fetch(
      `${PINATA_CONFIG.apiUrl}/pinning/pinJSONToIPFS`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PINATA_CONFIG.jwt}`,
        },
        body: data,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Pinata API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(
        `Pinata upload failed: ${response.status} - ${errorText}`
      );
    }

    const result: PinataUploadResponse = await response.json();

    // Log the CID to console
    console.log("✅ Successfully uploaded to Pinata IPFS!");
    console.log("📦 IPFS CID:", result.IpfsHash);
    console.log("📊 Pin Size:", result.PinSize);
    console.log("🕒 Timestamp:", result.Timestamp);
    console.log(
      "🔗 Gateway URL:",
      `${PINATA_CONFIG.gateway}${result.IpfsHash}`
    );

    return result.IpfsHash;
  } catch (error) {
    console.error("❌ Failed to upload to Pinata:", error);
    throw error; // Don't use mock data - fail properly
  }
}

/**
 * Fetch content from IPFS via Pinata gateway
 */
export async function fetchFromIPFS(ipfsHash: string): Promise<any> {
  try {
    // Remove any ipfs:// prefix if present
    const cleanHash = ipfsHash.replace(/^ipfs:\/\//, "");

    console.log("📥 Fetching from IPFS:", cleanHash);

    const response = await fetch(`${PINATA_CONFIG.gateway}${cleanHash}`);

    if (!response.ok) {
      throw new Error(
        `IPFS fetch failed: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("✅ Successfully fetched from IPFS:", cleanHash);

    return data;
  } catch (error) {
    console.error("❌ Failed to fetch from IPFS:", error);
    throw error;
  }
}

/**
 * Upload file to IPFS via Pinata (for future file uploads)
 */
export async function uploadFileToIPFS(
  file: File,
  metadata?: PinataMetadata
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const pinataMetadata = JSON.stringify({
      name: metadata?.name || file.name,
      keyvalues: {
        type: "file",
        originalName: file.name,
        size: file.size.toString(),
        ...metadata?.keyvalues,
      },
    });

    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });

    formData.append("pinataOptions", pinataOptions);

    const response = await fetch(
      `${PINATA_CONFIG.apiUrl}/pinning/pinFileToIPFS`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PINATA_CONFIG.jwt}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Pinata file upload failed: ${response.status} - ${errorText}`
      );
    }

    const result: PinataUploadResponse = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error("Failed to upload file to Pinata:", error);
    throw error;
  }
}

/**
 * Get pinned content list from Pinata
 */
export async function getPinnedContent(): Promise<any> {
  try {
    const response = await fetch(
      `${PINATA_CONFIG.apiUrl}/data/pinList?status=pinned`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PINATA_CONFIG.jwt}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get pinned content: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to get pinned content:", error);
    throw error;
  }
}

/**
 * Unpin content from Pinata
 */
export async function unpinContent(ipfsHash: string): Promise<void> {
  try {
    const response = await fetch(
      `${PINATA_CONFIG.apiUrl}/pinning/unpin/${ipfsHash}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${PINATA_CONFIG.jwt}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to unpin content: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to unpin content:", error);
    throw error;
  }
}
