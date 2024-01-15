const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "products.json");


const getProductsFromFile = (cb) => {

    fs.readFile(p, (err, fileContent) => {
      // this is a callback function that will be executed once the file is read
      if (err) {
        cb([]);; //if there is an error, return an empty array
      }
      else{
        cb(JSON.parse(fileContent)); // this will parse the file content into a javascript object
      }
    });
    //return products;
  }


module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
        products.push(this); // this refers to the object created by the constructor

        //write the file
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  };
};
