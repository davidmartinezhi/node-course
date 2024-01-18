const Product = require("../models/product");
const Cart = require("../models/cart");

/**
 * Get all products and render the product list view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getProducts = (req, res, next) => {
  // this will fetch all the products with sequelize
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));

  // this will fetch all the products with just sql
  // Product.fetchAll()
  //   .then(([rows, fieldData]) => {
  //     res.render("shop/product-list", {
  //       prods: rows,
  //       docTitle: "All Products",
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

/**
 * Get all products and render the index view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getIndex = (req, res, next) => {
  // this will fetch all the products with sequelize
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));

  // this will fetch all the products with just sql
  // Product.fetchAll()
  //   .then(([rows, fieldData]) => {
  //     res.render("shop/index", {
  //       prods: rows,
  //       docTitle: "Shop",
  //       path: "/",
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

/**
 * Render the cart view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    // this will fetch the cart
    Product.fetchAll((products) => {
      // this will fetch all the products

      const cartProducts = []; // this will store the products in the cart

      for (product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        ); // this will find the product in the cart
        if (cartProductData) {
          // this will check if the product is in the cart
          //product.qty = cart.products.find(prod => prod.id === product.id).qty; // this will set the quantity of the product
          cartProducts.push({ productData: product, qty: cartProductData.qty }); // this will add the product to the cart
        }
      }

      res.render("shop/cart", {
        docTitle: "Your Cart",
        path: "/cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId; // this will get the product id from the request body
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, +product.price); // this will delete the product from the cart
    res.redirect("/cart");
  }); // this will get the product from the database
};

/**
 * Render the orders view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    docTitle: "Your Orders",
    path: "/orders",
  });
};

/**
 * Render the checkout view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(([product]) => {
      res.render("shop/product-detail", {
        product: product[0],
        docTitle: product[0].title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};
