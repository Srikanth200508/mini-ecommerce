const fs = require('fs').promises;
const path = require('path');

/**
 * Safely reads JSON data from the specified file.
 * @param {string} filename - e.g. 'products.json'
 * @param {any} defaultFallback - Fallback value if file doesn't exist
 * @returns {Promise<any>}
 */
async function readJson(filename, defaultFallback = []) {
  const filePath = path.join(__dirname, filename);
  try {
    const rawData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If file doesn't exist, create it with fallback
      await writeJson(filename, defaultFallback);
      return defaultFallback;
    }
    console.error(`Error reading ${filename}:`, error.message);
    throw error;
  }
}

/**
 * Safely writes data to the specified JSON file.
 * @param {string} filename - e.g. 'orders.json'
 * @param {any} data - JavaScript object/array to serialize
 * @returns {Promise<void>}
 */
async function writeJson(filename, data) {
  const filePath = path.join(__dirname, filename);
  const formatted = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, formatted, 'utf-8');
}

module.exports = {
  readJson,
  writeJson,
};

