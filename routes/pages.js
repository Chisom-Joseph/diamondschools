const router = require("express").Router();

// Contact
router.get("/contact", (req, res) => {
  res.render("pages/contact.ejs", {
    title: `Contact Us | ${req.siteSettings.name}`,
    siteSettings: req.siteSettings,
  });
});

// About
router.get("/about", (req, res) => {
  res.render("pages/about.ejs", {
    title: `About Us | ${req.siteSettings.name}`,
    siteSettings: req.siteSettings,
  });
});

// Faq
router.get("/faq", (req, res) => {
  res.render("pages/faq.ejs", {
    title: `FAQ | ${req.siteSettings.name}`,
    siteSettings: req.siteSettings,
  });
});

// Enroll
router.get("/enroll", async (req, res) => {
  const { Country, State } = require("country-state-city");
  res.render("pages/enroll.ejs", {
    title: `Enroll | ${req.siteSettings.name}`,
    siteSettings: req.siteSettings,
    alert: req.flash("alert")[0] || "",
    form: req.flash("form")[0] || "",
    academicYears: await require("../utils/getAcademicYears")(),
    religions: await require("../utils/getReligions")(),
    genders: await require("../utils/getGenders")(),
    classes: await require("../utils/getClasses")(),
    examinationDate: await require("../utils/getExaminationDate")(),
    occupations: await require("../utils/getOccupations")(),
    relationships: await require("../utils/getRelationships")(),
    countries: Country.getAllCountries(),
    states: State.getAllStates(),
  });
});
router.post("/enroll", require("../controllers/enroll"));

// Faq
router.get("/aspirant-info", (req, res) => {
  const aspirant = req.flash("aspirant");
  if (aspirant.length === 0)
    return res.render("pages/404.ejs", {
      title: `404 Error | ${req.siteSettings.name}`,
      siteSettings: req.siteSettings,
    });

  res.render("pages/aspirantInfo.ejs", {
    title: `Aspirant | ${req.siteSettings.name}`,
    siteSettings: req.siteSettings,
    aspirant: aspirant[0] || "",
  });
});

module.exports = router;
