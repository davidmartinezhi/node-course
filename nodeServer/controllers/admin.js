const Product = require("../models/product");

/**
 * Renders the add product page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

/**
 * Handles the addition of a new product.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  try{
    const product = new Product(title, imageUrl, description, price); // this will create a new product with just sql
    await product.save(); // this will save the product to the database
    console.log("Created Product");
    res.redirect("/admin/products");
  }catch(err){
    console.log(err);
  }
};

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit; // this will return true if the query string has edit=true

//   if (!editMode) {
//     return res.redirect("/");
//   }

//   // Extract the product id from the url
//   const prodId = req.params.productId;
//   console.log("=====", req.user);
//   req.user.getProducts({ where: { id: prodId } }) // this will get the products associated with the user
//   // Fetch the product from the database with sequelize
//   //Product.findByPk(prodId)
//     .then((product) => {
//       if (!product) {
//         return res.redirect("/");
//       }
//       res.render("admin/edit-product", {
//         docTitle: "Edit Product",
//         path: "/admin/edit-product",
//         editing: editMode,
//         product: product,
//       });
//     })
//     .catch((err) => console.log(err));

//   // Fetch the product from the database with just sql
//   // Product.findById(prodId, (product) => {
//   //   if (!product) {
//   //     return res.redirect("/");
//   //   }
//   //   res.render("admin/edit-product", {
//   //     docTitle: "Edit Product",
//   //     path: "/admin/edit-product",
//   //     editing: editMode,
//   //     product: product,
//   //   });
//   // });
// };

// exports.postEditProduct = (req, res, next) => {
//   //extract info from the product
//   const prodId = req.body.productId;

//   //Extract the updated info from the product
//   const updatedTitle = req.body.title;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedPrice = req.body.price;
//   const updatedDescription = req.body.description;

//   // Update the product in the database with sequelize
//   Product.updateById(prodId).then(product => {
//     product.title = updatedTitle;
//     product.imageUrl = updatedImageUrl;
//     product.price = updatedPrice;
//     product.description = updatedDescription;

//     //if product exists, it will update it, else it will create a new product
//     return product.save(); // this will save the updated product to the database
//   }).then( result => { //this block will handle the result of the save() method
//     console.log("Updated Product");
//     res.redirect("/admin/products");
//   }).catch( err => console.log(err)); // this will catch any errors on any of the promises


//   // Update the product in the database with sql
//   // const updatedProduct = new Product(
//   //   prodId,
//   //   updatedTitle,
//   //   updatedImageUrl,
//   //   updatedDescription,
//   //   updatedPrice
//   // );

//   // updatedProduct.save(); // this will update the product in the database

//   //res.redirect("/admin/products");
// };

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId; // this will extract the product id from the request body
//   // Product.deleteById(prodId); // this will delete the product from the database, using file saving

//   Product.findByPk(prodId) // this will delete the product from the database with sequelize
//     .then(product => {
//       return product.destroy();
//     })
//     .then(result => {
//       console.log("Destroyed Product");
//       res.redirect("/admin/products");
//     })
//     .catch(err => console.log(err));
// };

exports.getProducts = (req, res, next) => {
  // Product.findAll()
  Product.fetchAll() // this will get the products associated with the user
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        docTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};
