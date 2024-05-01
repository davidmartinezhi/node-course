const fs = require("fs");
const path = require("path");

// Helper function to clear the image
clearImage = (filePath) => {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => console.log(err));
};

exports.clearImage = clearImage;