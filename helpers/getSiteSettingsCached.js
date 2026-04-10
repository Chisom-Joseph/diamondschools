/**
 * Site Settings Cache Helper
 * Caches site settings to avoid database calls on every request
 */

const { SiteSettings } = require("../models");

const defaults = {
  name: "Diamond Schools",
  title: "Diamond Schools",
  description: "Diamond Schools",
  keywords: "Diamond Schools",
  email: "diamondschoolsnkpor@gmail.com",
  address: "No.7 Ernest Odili Crescent, Nkpor, Anambra State, Nigeria",
  phone1: "07057430682",
  phone2: "08026125461",
  phone3: "08130331977",
  favicon: "/assets/img/logo/favicon.png",
  logo: "/assets/img/logo/logo.png",
  logoLight: "/assets/img/logo/logo-light.png",
};

// Cache configuration
let cachedSettings = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Get site settings with caching
 * @returns {Promise<Object>} Site settings object
 */
module.exports = async () => {
  const now = Date.now();
  
  // Return cached settings if still valid
  if (cachedSettings && (now - lastFetchTime) < CACHE_TTL) {
    return cachedSettings;
  }
  
  try {
    const siteSettings = await SiteSettings.findOne({
      where: { uniqueKey: 1 },
    });
    
    if (!siteSettings) {
      cachedSettings = defaults;
    } else {
      cachedSettings = siteSettings.toJSON();
    }
    
    lastFetchTime = now;
    return cachedSettings;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    // Return cached settings or defaults on error
    return cachedSettings || defaults;
  }
};

/**
 * Clear the cache (useful when settings are updated)
 */
module.exports.clearCache = () => {
  cachedSettings = null;
  lastFetchTime = 0;
};
