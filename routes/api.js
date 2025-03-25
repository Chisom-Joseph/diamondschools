const router = require("express").Router();

router.post("/addStudentPhoto", require("../controllers/api/addStudentPhoto"));

router.post(
  "/deleteStudentPhoto",
  require("../controllers/api/deleteStudentPhoto")
);

router.post("/addTeacherPhoto", require("../controllers/api/addTeacherPhoto"));

module.exports = router;
