import crypto from "crypto";

/**
 * Generate random token for file sharing
 * @returns {string} Random token (64 hex characters)
 */
const generateShareToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Calculate share expiry date
 * @param {number} daysFromNow - Number of days until expiry
 * @returns {Date} Expiry date
 */
const calculateShareExpiry = (daysFromNow = 7) => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + daysFromNow);
  return expiry;
};

/**
 * Check if share token is expired
 * @param {Date} expiryDate - Share expiry date
 * @returns {boolean} True if expired
 */
const isShareExpired = (expiryDate) => {
  return new Date() > expiryDate;
};

export { generateShareToken, calculateShareExpiry, isShareExpired };
