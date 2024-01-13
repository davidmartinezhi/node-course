const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    //path to saving products in a file
    const p = path.join(rootDir, "data", "products.json");

    //read the file
    fs.readFile(p, (err, fileContent) => {
      // this is a callback function that will be executed once the file is read
      let products = [];

      if (!err) {
        //if there is an error, return an empty array
        products = JSON.parse(fileContent); // this will parse the file content into a javascript object
      }

      products.push(this); // this refers to the object created by the constructor

      //write the file
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {

    const p = path.join(rootDir, "data", "products.json");

    fs.readFile(p, (err, fileContent) => {
      // this is a callback function that will be executed once the file is read
      if (err) {
        cb([]);; //if there is an error, return an empty array
      }
      cb(JSON.parse(fileContent)); // this will parse the file content into a javascript object
    });
    //return products;
  }
};
