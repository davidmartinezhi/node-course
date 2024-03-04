const Product = require("../models/product");

/**
 * Renders the add product page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
};

/**
 * Handles the addition of a new product.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title.trim();
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  console.log(req.session.user);

  try {
    //in mongoose we pass a javasccript object where we map
    const product = new Product({
      title: title,
      imageUrl: imageUrl,
      description: description,
      price: price,
      //mongoose will automatically extract the id from the user object
      userId: req.session.user, // this will create a new product associated with the user
    }); // this will create a new product

    //mongoose has a save method also
    await product.save(); // this will save the product to the database
    console.log("Created Product");
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit; // this will return true if the query string has edit=true

  if (!editMode) {
    return res.redirect("/");
  }

  // Extract the product id from the url
  const prodId = req.params.productId;

  // Fetch the product from the database with sequelize
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = async (req, res, next) => {
  //extract info from the product
  const prodId = req.body.productId;

  //Extract the updated info from the product
  const updatedTitle = req.body.title.trim();
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  try {
    //fetch a product from the database
    const product = await Product.findById(prodId);
    product.title = updatedTitle;
    product.imageUrl = updatedImageUrl;
    product.price = updatedPrice;
    product.description = updatedDescription;

    await product.save(); // this will save the updated product to the database
    console.log("Updated Product");
    res.redirect("/admin/products");

  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId; // this will extract the product id from the request body

  try {
    await Product.findByIdAndDelete(prodId); // this will delete the product from the database
    console.log("Destroyed Product"); // this will log a message to the console
    res.redirect("/admin/products"); // this will redirect to the products page
  } catch (err) {
    console.log(err); // this will log an error to the console
  }
};

exports.getProducts = (req, res, next) => {
  // Product.findAll()
  Product.find() // this will get the products associated with the user
  //.select("title price -_id") // this will select the title and price of the products and exclude the id
  //.populate("userId") //this will populate ids of references with the complete information, second argument is the fields we want to populate
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
