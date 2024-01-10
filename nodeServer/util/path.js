const path = require("path");

module.exports = path.dirname(process.mainModule.filename); // this will give us the path to the root directory of our project
