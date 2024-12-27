const router = require("express").Router();

router.get("/contact", (req, res) => {
    res.render("pages/contact.ejs",  {
        title: `Contact Us | ${req.siteSettings.name}`,
        siteSettings: req.siteSettings,
      })
})

router.get("/about", (req, res) => {
    res.render("pages/about.ejs",  {
        title: `About Us | ${req.siteSettings.name}`,
        siteSettings: req.siteSettings,
      })
})

router.get("/faq", (req, res) => {
    res.render("pages/faq.ejs",  {
        title: `FAQ | ${req.siteSettings.name}`,
        siteSettings: req.siteSettings,
      })
})

module.exports = router;
