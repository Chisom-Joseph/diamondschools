const router = require("express").Router();

router.post("/addStudentPhoto", require("../controllers/api/addStudentPhoto"));

router.post("/addTeacherPhoto", require("../controllers/api/addTeacherPhoto"));

module.exports = router;
