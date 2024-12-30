const logger = require("./logger");
const { Class } = require("../models");

module.exports = async (id) => {
  try {
    if (!id) return {};

    const classFromDb = await Class.findOne({ where: { id } });
    if (!classFromDb) return {};

    console.log(classFromDb.dataValues);

    return classFromDb.dataValues;
  } catch (error) {
    logger.error(`ERROR GETTING CLASS: ${error}`);
    return {};
  }
};
