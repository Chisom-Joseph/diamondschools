module.exports = async (req, res) => {
  try {
    return res.json({
      success: true,
    });
    console.log(req.body);
  } catch (error) {
    console.log("SOMTHING WENT WRONG COPYING ASPIRANT PHOTO TO STUDENT FOLDER");
    console.log(error);
  }
};
