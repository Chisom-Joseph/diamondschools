const router = require("express").Router();

router.post("/addStudentPhoto", require("../controllers/api/addStudentPhoto"));

module.exports = router;
