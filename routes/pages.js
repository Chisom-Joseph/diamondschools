const router = require("express").Router();

// About Us page
router.get("/about-us", (req, res) => {
  res.render("pages/aboutUs", {
    title: `About Us | ${req.siteSettings.name}`,
    siteSettings: req.siteSettings,
  });
});

// Contact Us page
router.get("/contact-us", (req, res) => {
  res.render("pages/contactUs", {
    title: `Contact Us | ${req.siteSettings.name}`,
    siteSettings: req.siteSettings,
  });
});

module.exports = router;
