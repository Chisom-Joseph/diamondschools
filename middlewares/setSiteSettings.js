const getSiteSettings = require("../helpers/getSiteSettings");
module.exports = (req, res, next) => {
  req.siteSettings = getSiteSettings();
  next();
};
