const router = require("express").Router();

router.use(require("../middlewares/setSiteSettings"));
router.use("/page", require("./pages"));

// Home page
router.get("/", (req, res) => {
  res.render("pages/home", {
    title: `Home | ${req.siteSettings.name}`,
    siteSettings: req.siteSettings,
  });
});

// 404
router.get("*", (req, res) => {
  res.render("pages/404", {
    title: `404 Error | ${req.siteSettings.name}`,
    siteSettings: req.siteSettings,
  });
});

module.exports = router;
