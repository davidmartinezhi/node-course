const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "cart.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // this will add a new product to the cart or update the quantity of an existing product

    //fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      // If there is an error, then we don't have a cart yet
      let cart = { products: [], totalPrice: 0 };

      // If there is no error, then we have a cart
      if (!err) {
        cart = JSON.parse(fileContent); // parse the file content into a javascript object
      }

      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      ); // this will return the index of the product if it exists in the cart
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;

      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct }; // this will create a new object with the same properties as the existing product
        updatedProduct.qty = updatedProduct.qty + 1; // this will update the quantity of the product
        cart.products = [...cart.products]; // this will create a new array of products
        cart.products[existingProductIndex] = updatedProduct; // this will update the product in the products array
      } else {
        updatedProduct = { id: id, qty: 1 }; // this will create a new product with the given id and quantity
        cart.products = [...cart.products, updatedProduct]; // this will add the updated product to the products array
      }

      //update price
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    //fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return; // if there is an error, then we don't have a cart yet
      } else {
        const updatedCart = { ...JSON.parse(fileContent) }; // parse the file content into a javascript object
        const product = updatedCart.products.find((prod) => prod.id === id); // this will return the product to be deleted
        
        if (!product) {
          return; // if there is no product to be deleted, then we don't have a cart yet
        }

        const productQty = product.qty; // this will store the quantity of the product to be deleted

        //update the cart
        updatedCart.products = updatedCart.products.filter((prod) => prod.id !== id); // this will filter out the product to be deleted
        updatedCart.totalPrice = updatedCart.totalPrice - (productPrice * productQty); // this will update the total price of the cart
        fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
          console.log(err);
        });
      }
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {

        const cart  = JSON.parse(fileContent); // parse the file content into a javascript object

        if(err){
            cb(null); // if there is an error, then we don't have a cart yet
        }
        else{
            cb(cart); // if there is no error, then we have a cart
        }

    });
  }
};
