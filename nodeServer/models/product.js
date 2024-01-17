const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    // this is a callback function that will be executed once the file is read
    if (err) {
      cb([]); //if there is an error, return an empty array
    } else {
      cb(JSON.parse(fileContent)); // this will parse the file content into a javascript object
    }
  });
  //return products;
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      //editing product
      if (this.id) {
        //check if we are editing a product
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        ); // this will return the index of the product if it exists in the cart
        const updatedProducts = [...products]; // this will create a new array of products
        updatedProducts[existingProductIndex] = this; // this will update the product in the products array
        //write the file
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        //creating a product
        this.id = Math.random().toString(); // this will generate a random id for each product
        products.push(this); // this refers to the object created by the constructor

        //write the file
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
};
