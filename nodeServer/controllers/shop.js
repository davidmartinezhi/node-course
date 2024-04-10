const fs = require("fs");
const path = require("path");
const Product = require("../models/product");
const Order = require("../models/order");
const PDFDocument = require("pdfkit");
const env = require("dotenv").config();
const stripe = require("stripe")(env.parsed.STRIPE_KEY);

const ITEMS_PER_PAGE = 2;

/**
 * Get all products and render the product list view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1; // this will get the page from the query parameters

  let totalItems;

  //get the number of products
  Product.find()
    .countDocuments()
    .then((numProducts) => {
      // this will get the number of products

      console.log("number of products: ", numProducts);
      totalItems = numProducts; // this will store the number of products
      return Product.find() // this will return all the products automatically
        .skip((page - 1) * ITEMS_PER_PAGE) // this will skip the products, PAGE 1: 0 * 2 = 0, PAGE 2: 1 * 2 = 2, we are skipping those previous items
        .limit(ITEMS_PER_PAGE); // this will limit the products to just 2
    })
    .then((products) => {
      //once we have the products, we render the view
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems, // this will check if we have a next page
        hasPreviousPage: page > 1, // this will check if we have a previous page
        nextPage: page + 1, // this will store the next page
        previousPage: page - 1, // this will store the previous page
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE), // this will store the last page
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
  const page = +req.query.page || 1; // this will get the page from the query parameters

  let totalItems;

  //get the number of products
  Product.find()
    .countDocuments()
    .then((numProducts) => {
      // this will get the number of products
      totalItems = numProducts; // this will store the number of products
      return Product.find() // this will return all the products automatically
        .skip((page - 1) * ITEMS_PER_PAGE) // this will skip the products, PAGE 1: 0 * 2 = 0, PAGE 2: 1 * 2 = 2, we are skipping those previous items
        .limit(ITEMS_PER_PAGE); // this will limit the products to just 2
    })
    .then((products) => {
      //once we have the products, we render the view
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems, // this will check if we have a next page
        hasPreviousPage: page > 1, // this will check if we have a previous page
        nextPage: page + 1, // this will store the next page
        previousPage: page - 1, // this will store the previous page
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE), // this will store the last page
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log(err);

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
    let cart = await req.user.getCart();
    cart = await cart.populate("items.productId").execPopulate(); // this will populate the product id in the cart

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
    console.log(err);

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
exports.getCheckout = async (req, res, next) => {
  try {
    let cart = await req.user.getCart();
    console.log("cart: " + cart);
    cart = await cart.populate("items.productId").execPopulate()

    const products = cart.items;
    let total = 0;

    products.forEach((p) => {
      total += +p.quantity * +p.productId.price;
    });

    //we pass an object with the session details
    const session = await stripe.checkout.sessions.create({
      line_items: products.map(p => {
        return  {
            price_data: {
              currency: "usd",
              unit_amount: parseInt(Math.ceil(p.productId.price * 100)),
              product_data: {
                name: p.productId.title,
                description: p.productId.description,
              },
            },
            quantity: p.quantity,
          }
        }),
        mode: "payment",
        success_url: req.protocol + "://" + req.get("host") + "/checkout/success",// => http://localhost:3000, this will redirect to the success page
        cancel_url: req.protocol + "://" + req.get("host") + "/checkout/cancel",
  });

  res.redirect(303, session.url);
    // res.render("shop/checkout", {
    //   pageTitle: "Checkout",
    //   path: "/checkout",
    //   products: products,
    //   isAuthenticated: req.session.isLoggedIn,
    //   totalSum: total,
    //   sessionId: session.id
    // });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    console.log(err);

    // this will skip all the other middlewares ang go to the error handling middleware
    return next(error);
  }
};


exports.getCheckoutSuccess = async (req, res, next) => {
  try {
    let cart = await req.user.getCart();
    cart = await cart.populate("items.productId").execPopulate(); // this will populate the product id in the cart

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
    console.log(err);

    // this will skip all the other middlewares ang go to the error handling middleware
    return next(error);
  }
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

      /*
      Files can be
        - Generated on the fly
        - Stored in memory before sending
        - Streamed
      */

      //create a pdf document
      const pdfDoc = new PDFDocument(); // this will create a new pdf document, this is a readable stream

      //we set the headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      ); // this will force the download

      //readable stream can be piped into a writeable stream
      //this ensures pdf is also stored in the server
      pdfDoc.pipe(fs.createWriteStream(invoicePath)); // this will pipe the pdf document to a writeable stream
      pdfDoc.pipe(res); // this will pipe the pdf document to the response

      //this will add the content to the pdf document
      pdfDoc.fontSize(26).text("Invoice");
      pdfDoc.fontSize(14).text("-----------------------");

      let totalPrice = 0;
      console.log("order products: ", order.products);
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            `${prod.product.title} - ${prod.quantity} x $${prod.product.price}`
          );
      });

      pdfDoc.text(`Total price: ${totalPrice}`);

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
