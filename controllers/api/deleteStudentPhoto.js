const fs = require("fs");
const path = require("path");
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

    sutdentProfileImageUpload(req, res, async (err) => {
      let deletedFilePath = "";
      // Extract filename from URL and build the correct file path
      if (req.body.profilePhoto) {
        const filename = path.basename(req.body.profilePhoto); // Extracts 'file-1742220856637.jpg'
        const filePath = path.join(
          __dirname,
          "../../public/assets/img/studentPhotos",
          filename
        );

        // Check if the file exists and delete it
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          deletedFilePath = filePath;
          console.log(`Deleted existing file: ${filePath}`);
        } else {
          console.log(`File not found: ${filePath}`);
        }
      }

      console.log(req.body);
      return res.json({
        success: true,
        deletedFilePath,
      });
    });
  } catch (error) {
    console.log(
      "SOMTHING WENT WRONG UPLOADING ASPIRANT PHOTO TO STUDENT FOLDER"
    );
    console.log(error);
  }
};
