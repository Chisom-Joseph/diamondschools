const multer = require("multer");
const { Country } = require("country-state-city");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");
const validationSchema = require("../validation/enroll");
const { aspirantUpload } = require("../middlewares/aspirantUpload");

const { Aspirant, Guardian } = require("../models");

module.exports = async (req, res) => {
  try {
    aspirantUpload(req, res, async function (err) {
      // Upload payment proof
      if (err instanceof multer.MulterError) {
        if ((err.code = "LIMIT_FILE_SIZE")) {
          req.flash("alert", {
            status: "error",
            message: "File size too large. Maximum file size is 2MB",
          });
          req.flash("form", req.body);
          req.flash("status", 400);
          return res.redirect("/pages/enroll");
        } else if (err) {
          req.flash("alert", {
            status: "error",
            message: "Failed to upload file",
          });
          req.flash("form", req.body);
          req.flash("status", 400);
          return res.redirect("/pages/enroll");
        }
      }

      const deleteUploadedFiles = require("../utils/deleteUploadedFiles");

      // Validate details
      const enrollmentValid = await validationSchema.validate(req.body);
      if (enrollmentValid.error) {
        deleteUploadedFiles(req.files);

        req.flash("alert", {
          status: "error",
          message: enrollmentValid.error.message,
        });
        req.flash("form", req.body);
        req.flash("status", 400);
        return res.redirect("/pages/enroll");
      }

      // Check if photo was uploaded
      if (!req.files["photo"] || req.files["photo"].length === 0) {
        deleteUploadedFiles(req.files);
        req.flash("alert", {
          status: "error",
          message: "Photo is required",
        });
        req.flash("form", req.body);
        req.flash("status", 400);
        return res.redirect("/pages/enroll");
      }

      // Check if payment proof was uploaded
      if (
        !req.files["paymentProof"] ||
        req.files["paymentProof"].length === 0
      ) {
        deleteUploadedFiles(req.files);
        req.flash("alert", {
          status: "error",
          message: "Payment proof is required",
        });
        req.flash("form", req.body);
        req.flash("status", 400);
        return res.redirect("/pages/enroll");
      }

      // Check if guardian email is already in use
      const guardianEmailExists = await Guardian.findOne({
        where: { email: req.body.guardianEmail },
      });
      if (guardianEmailExists) {
        deleteUploadedFiles(req.files);
        req.flash("alert", {
          status: "error",
          message: "Guardian email already in use",
        });
        req.flash("form", req.body);
        req.flash("status", 400);
        return res.redirect("/pages/enroll");
      }

      // Create guardian
      const newGuardian = await Guardian.create({
        firstName: req.body.guardianFirstName,
        middleName: req.body.guardianMiddleName,
        lastName: req.body.guardianLastName,
        email: req.body.guardianEmail,
        phoneNumber: req.body.guardianPhoneNumber,
        address: req.body.guardianAddress,
        ocupation: req.body.guardianOcupation,
        relationshipToStudent: req.body.relationshipToStudent,
        country: req.body.country, // may be unneccessary
        dateOfBirth: req.body.dateOfBirth, // may be unneccessary
      });
      console.log(newGuardian);

      const examinationNumber = await require("../utils/genExamNumber")();
      const password = await require("../utils/genPassword")();
      const profileImageUrl = `${process.env.MAIN_WEBSITE_URL}/assets/img/studentPhotos/${req.files["photo"][0].filename}`;
      const paymentProofUrl = `${process.env.MAIN_WEBSITE_URL}/assets/img/paymentProofs/${req.files["paymentProof"][0].filename}`;

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create aspirant
      const newAspirant = await Aspirant.create({
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        address: req.body.address,
        country: req.body.country,
        stateOfOrigin: req.body.stateOfOrigin,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        religion: req.body.religion,
        academicYear: req.body.academicYear,
        country: Country.getCountryByCode(req.body.country).name,
        profileImageUrl,
        paymentProofUrl,
        examinationNumber,
        examinationDate: await require("../utils/getExaminationDate")(),
        password: hashedPassword,
        ClassId: req.body.class,
        GuardianId: newGuardian.id,
      });
      console.log(newAspirant);

      const aspirant = newAspirant.dataValues;
      aspirant.guardian = newGuardian.dataValues;
      aspirant.plainPassword = password;
      aspirant.examinationTime = "1pm - 6:30pm";
      aspirant.examinationNumber = examinationNumber;
      (aspirant.class = await require("../utils/getClass")(req.body.class)),
        console.log(aspirant);

      req.flash("aspirant", aspirant);
      return res.redirect("/pages/aspirant-info");
    });
  } catch (error) {
    logger.error("ERROR ENROLLING");
    logger.error(error.stack);

    req.flash("alert", {
      status: "error",
      message: "Something went wrong, please try again",
    });
    req.flash("form", req.body);
    req.flash("status", 400);
    return res.redirect("/pages/enroll");
  }
};
