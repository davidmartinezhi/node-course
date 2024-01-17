const Product = require("../models/product");
const Cart = require("../models/cart");

/**
 * Get all products and render the product list view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      docTitle: "All Products",
      path: "/products",
    });
  }); // this will fetch all the products
};

/**
 * Get all products and render the index view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      docTitle: "Shop",
      path: "/",
    });
  }); // this will fetch all the products
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
  Product.findById(prodId, (product) => {
    // console.log(product);
    res.render("shop/product-detail", {
      product: product,
      docTitle: product.title,
      path: "/products",
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
