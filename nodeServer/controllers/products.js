const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  //if it starts with /add-product, it will execute this middleware
  //res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeProduct: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  //if it starts with /product, it will execute this middleware
  //products.push({ title: req.body.title }); // req.body is provided by body-parser
  const product = new Product(req.body.title); // this will create a new product object
  product.save(); // this will save the product to the products array
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop", {
      prods: products,
      docTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  }); // this will fetch all the products
};
