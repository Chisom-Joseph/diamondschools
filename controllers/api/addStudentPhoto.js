module.exports = async (req, res) => {
  try {
    return res.json({
      success: true,
    });
  } catch (error) {
    console.log("SOMTHING WENT WRONG COPYING ASPIRANT PHOTO TO STUDENT FOLDER");
    console.log(error);
  }
};
