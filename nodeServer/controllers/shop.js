const fs = require("fs");
const path = require("path");
const Product = require("../models/product");
const Order = require("../models/order");
const PDFDocument = require("pdfkit");

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

  console.log("order id: ", orderId);
  console.log("invoice name: ", invoiceName);
  console.log("invoice path: ", invoicePath);

  //we validate if the order exists and if the user is the owner of the order
  Order.findById({ _id: orderId })
    .then((order) => {
      //validate if we have an order
      if (!order) {
        console.log("No order found");
        return next(new Error("No order found"));
      }

      //validate if the user is the owner of the order
      if (order.user.userId.toString() !== req.user._id.toString()) {
        console.log("Unauthorized");
        return next(new Error("Unauthorized"));
      }

      //create a pdf document
      const pdfDoc = new PDFDocument(); // this will create a new pdf document, this is a readable stream

      //we set the headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'inline; filename="' + invoiceName + '"'); // this will force the download

      //readable stream can be piped into a writeable stream
      //this ensures pdf is also stored in the server
      pdfDoc.pipe(fs.createWriteStream(invoicePath)); // this will pipe the pdf document to a writeable stream
      pdfDoc.pipe(res); // this will pipe the pdf document to the response

      //this will add the content to the pdf document
      pdfDoc.fontSize(26).text("Invoice");

      pdfDoc.text("-----------------------");
      pdfDoc.end(); // this will end the pdf document

      //if we have an order and the user is the owner, we send the file
      //for big files, we can use streams.
      //streaming is better because we dont have to load the entire file into memory
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     console.log(err);
      //     return next(err); // this will skip all the other middlewares ang go to the error handling middleware
      //   }
      //   //if we dont have and error, we send the file
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     'inline; filename="' + invoiceName + '"'
      //   ); // this will open the pdf in the browser
      //   // res.setHeader("Content-Disposition", 'attachment; filename="' + invoiceName + '"'); // this will force the download
      //   res.send(data);
      // });

      //streaming the file
      // const file = fs.createReadStream(invoicePath); // this will create a read stream

      //we set the headers
      // res.setHeader("Content-Type", "application/pdf");

      //we pipe the file to the response
      //for large files this is a huge advantage
      //node never has to preload the entire file into memory
      //it just streams it to the client on the flight
      //the most it has to store is one chunk of data, we foward them to the browser and it concatenates the chunks
      // file.pipe(res); //readable stream can be piped to writeable stream(res) and vice versa 

    })
    .catch((err) => {
      return next(err);
    });
};
