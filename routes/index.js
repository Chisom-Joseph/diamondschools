const router = require("express").Router();

router.use(require("../middlewares/setSiteSettings"));

// Home page
router.get("/", (req, res) => {
  res.render("pages/home", { siteSettings: req.siteSettings });
  console.log(req.siteSettings);
});

// 404
router.get("*", (req, res) => {
  res.render("pages/404", { siteSettings: req.siteSettings });
});

module.exports = router;
