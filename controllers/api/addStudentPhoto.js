const fs = require("fs");
const path = require("path");
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

      console.log(req.body);

      // Extract filename from URL and build the correct file path
      if (req.body.previousProfilePhoto) {
        const filename = path.basename(req.body.previousProfilePhoto); // Extracts 'file-1742220856637.jpg'
        const filePath = path.join(
          __dirname,
          "../../public/assets/img/studentPhotos",
          filename
        );

        // Check if the file exists and delete it
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted existing file: ${filePath}`);
        } else {
          console.log(`File not found: ${filePath}`);
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
