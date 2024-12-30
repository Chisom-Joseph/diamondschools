const logger = require("../utils/logger");

module.exports = async () => {
  try {
    return "Saturday 2nd December 2024";
  } catch (error) {
    logger.error(`ERROR GETTING EXAMINATION DATE`);
    logger.error(error.stack);
  }
};
