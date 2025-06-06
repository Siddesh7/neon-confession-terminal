// Pinata Configuration
// Using environment variable VITE_PINATA_JWT from .env file

export const PINATA_CONFIG = {
  // 🔑 JWT token from environment variable (set in .env file)
  jwt: import.meta.env.VITE_PINATA_JWT || "",

  // 🌐 Pinata API endpoint (don't change this)
  apiUrl: "https://api.pinata.cloud",

  // 🚪 Gateway for fetching content (don't change this unless you have a dedicated gateway)
  gateway: "https://gateway.pinata.cloud/ipfs/",

  // 💡 Optional: Your dedicated gateway (if you have one, uncomment and use this instead)
  // gateway: "https://your-gateway.mypinata.cloud/ipfs/",
};

// Validation function to check if credentials are set
export function validatePinataConfig(): boolean {
  const token = PINATA_CONFIG.jwt;

  // Debug logging
  console.log("🔍 Pinata JWT Token Debug:");
  console.log("Token exists:", !!token);
  console.log("Token length:", token?.length || 0);
  console.log("Token starts with:", token?.substring(0, 20) + "...");
  console.log("Token ends with:", "..." + token?.slice(-20));

  if (!token || token.trim() === "") {
    console.error("🚨 Pinata JWT token not configured!");
    console.error("📝 Please add VITE_PINATA_JWT to your .env file");
    console.error("🔗 Get your token from: https://app.pinata.cloud/keys");
    console.error(
      "💡 Example: VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    );
    return false;
  }

  // Check JWT format (should have 3 parts separated by dots)
  const jwtParts = token.split(".");
  console.log(`🔍 JWT Parts: ${jwtParts.length} (should be 3)`);

  if (jwtParts.length !== 3) {
    console.error("🚨 Invalid JWT token format!");
    console.error(
      `Token has ${jwtParts.length} segments, but JWT should have 3`
    );
    console.error("📝 A valid JWT looks like: eyJxxx.eyJxxx.xxxxx");
    console.error(
      "🔗 Please get a complete token from: https://app.pinata.cloud/keys"
    );
    console.error(
      "💡 Make sure you copy the ENTIRE token including the signature part!"
    );
    return false;
  }

  console.log(
    "✅ Pinata JWT token loaded from environment and format is valid"
  );
  return true;
}
