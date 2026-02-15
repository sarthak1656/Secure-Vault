import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Ensure encryption key is exactly 32 bytes (256 bits) for AES-256
if (!ENCRYPTION_KEY || Buffer.byteLength(ENCRYPTION_KEY, "utf8") < 32) {
  throw new Error("ENCRYPTION_KEY must be at least 32 bytes long");
}

/**
 * Encrypt file buffer using AES-256-CBC
 * @param {Buffer} buffer - File buffer to encrypt
 * @returns {object} { encryptedData, iv } - Encrypted buffer and IV (hex string)
 */
const encryptFile = (buffer) => {
  try {
    // Generate random IV (Initialization Vector)
    const iv = crypto.randomBytes(16);

    // Create cipher with AES-256-CBC
    const key = Buffer.from(ENCRYPTION_KEY, "utf8").slice(0, 32);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    // Encrypt the buffer
    let encryptedData = cipher.update(buffer);
    encryptedData = Buffer.concat([encryptedData, cipher.final()]);

    return {
      encryptedData,
      iv: iv.toString("hex"), // Store IV as hex string
    };
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
};

export { encryptFile };
