const multer = require("multer");
const sutdentProfileImageUpload = require("../../middlewares/studentProfileImageUpload ");

module.exports = async (req, res) => {
  try {
    // Verify access token
    const authHeader = req.headers["authorization"];
    const authToken = authHeader && authHeader.split(" ")[1];

    if (!authToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    if (authToken !== process.env.API_ACCESS_TOKEN) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    // Upload file
    sutdentProfileImageUpload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        if ((err.code = "LIMIT_FILE_SIZE")) {
          return res.status(400).json({
            error: {
              message: "File size too large. Maximum file size is 2MB",
            },
          });
        } else if (err) {
          return res.status(400).json({
            error: {
              message: "Failed to upload file",
            },
          });
        }
      }

      req.file.profileImageUrl = `${process.env.MAIN_WEBSITE_URL}/assets/img/studentPhotos/${req.file.filename}`;

      console.log(req.body);
      return res.json({
        success: true,
        file: req.file,
      });
    });
  } catch (error) {
    console.log(
      "SOMTHING WENT WRONG UPLOADING ASPIRANT PHOTO TO STUDENT FOLDER"
    );
    console.log(error);
  }
};
