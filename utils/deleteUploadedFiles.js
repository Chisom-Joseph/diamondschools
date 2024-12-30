const fs = require("fs");

module.exports = (files) => {
  if (!files) return;
  Object.keys(files).forEach((key) => {
    files[key].forEach((file) => {
      const filePath = file.path;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete file: ${filePath}`, err);
        }
      });
    });
  });
};
