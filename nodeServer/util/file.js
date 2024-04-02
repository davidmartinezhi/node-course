const fs = require("fs");

const deleteFile = (filePath) => {

    //unlink deletes a file and takes a callback function as a second argument
    fs.unlink(filePath, err => {
        if(err) {
            throw (err);
        }
    });
};

exports.deleteFile = deleteFile;