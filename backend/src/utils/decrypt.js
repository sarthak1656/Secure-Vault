import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

/**
 * Decrypt file buffer using AES-256-CBC
 * @param {Buffer} encryptedBuffer - Encrypted buffer
 * @param {string} ivHex - IV as hex string
 * @returns {Buffer} Decrypted buffer
 */
const decryptFile = (encryptedBuffer, ivHex) => {
  try {
    // Recreate IV from hex string
    const iv = Buffer.from(ivHex, "hex");

    // Create decipher with AES-256-CBC
    const key = Buffer.from(ENCRYPTION_KEY, "utf8").slice(0, 32);
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

    // Decrypt the buffer
    let decryptedData = decipher.update(encryptedBuffer);
    decryptedData = Buffer.concat([decryptedData, decipher.final()]);

    return decryptedData;
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
};

export { decryptFile };
