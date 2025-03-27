const logger = require("../utils/logger");
const { ExamSettings } = require("../models");
const moment = require("moment");

module.exports = async () => {
  try {
    const examSettings = await ExamSettings.findOne({});
    const { aspirantExaminationDate } = examSettings;

    if (!aspirantExaminationDate) throw new Error("No examination date found.");

    const formattedDate = moment(aspirantExaminationDate).format(
      "dddd Do MMMM YYYY"
    );

    return formattedDate;
  } catch (error) {
    logger.error(`ERROR GETTING EXAMINATION DATE`);
    logger.error(error.stack);
    return null;
  }
};
