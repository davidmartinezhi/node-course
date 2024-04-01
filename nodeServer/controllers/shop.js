const fs = require("fs");
const path = require("path");
const Product = require("../models/product");
const Order = require("../models/order");

/**
 * Get all products and render the product list view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getProducts = (req, res, next) => {
  Product.find() // this will return all the products automatically
    .then((products) => {
      console.log(products);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,

      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
  
      // this will skip all the other middlewares ang go to the error handling middleware
      return next(error); 
    });
};

/**
 * Get all products and render the index view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getIndex = (req, res, next) => {
  // this will fetch all the products with sequelize
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
  
      // this will skip all the other middlewares ang go to the error handling middleware
      return next(error); 
    });

  // this will fetch all the products with just sql
  // Product.fetchAll()
  //   .then(([rows, fieldData]) => {
  //     res.render("shop/index", {
  //       prods: rows,
  //       pageTitle: "Shop",
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
exports.getCart = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();

    console.log(cart.items);
    const products = cart.items;
    res.render("shop/cart", {
      pageTitle: "Your Cart",
      path: "/cart",
      products: products,
      isAuthenticated: req.session.isLoggedIn,

    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;

    // this will skip all the other middlewares ang go to the error handling middleware
    return next(error); 
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId; // this will get the product id from the request body

  try {
    const product = await Product.findById(prodId); // this will store the product
    const result = await req.user.addToCart(product); // this will add the product to the cart
    console.log(result);
    res.redirect("/cart");
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;

    // this will skip all the other middlewares ang go to the error handling middleware
    return next(error); 
  }
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId; // this will get the product id from the request body
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
  
      // this will skip all the other middlewares ang go to the error handling middleware
      return next(error); 
    });
  // Product.findById(prodId, (product) => {
  //   Cart.deleteProduct(prodId, +product.price); // this will delete the product from the cart
  //   res.redirect("/cart");
  // }); // this will get the product from the database
};

exports.postOrder = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    // console.log(cart.items);

    const products = cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    }); // this will get the products in the expected format
    // console.log("====================================");
    // console.log(products);

    const order = new Order({
      user: {
        email: req.user.email, // this will store the user name
        userId: req.user, // this will store the user id
      },
      products: products, // this will store the products in the cart
    });

    await order.save(); // this will save the order to the database

    await req.user.clearCart(); // this will clear the users cart

    res.redirect("/orders"); // this will redirect to the orders page
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;

    // this will skip all the other middlewares ang go to the error handling middleware
    return next(error); 
  }
};

/**
 * Render the orders view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getOrders = async (req, res, next) => {
  try {

    const orders = await req.user.getOrders();

    res.render("shop/orders", {
      pageTitle: "Your Orders",
      path: "/orders",
      orders: orders,
      isAuthenticated: req.session.isLoggedIn,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;

    // this will skip all the other middlewares ang go to the error handling middleware
    return next(error); 
  }
};

/**
 * Render the checkout view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId; // this will get the product id from the request parameters

  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
  
      // this will skip all the other middlewares ang go to the error handling middleware
      return next(error); 
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId; // this will get the order id from the request parameters

  const invoiceName = "invoice-" + orderId + ".pdf"; // this will store the invoice name
  const invoicePath = path.join("data", "invoices", invoiceName); // this will store the invoice path

  fs.readFile(invoicePath, (err, data) => {
    if (err) {
      return next(err); // this will skip all the other middlewares ang go to the error handling middleware
    }

    //if we dont have and error, we send the file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="' + invoiceName + '"');
    res.send(data);
  });
};
