const Product = require("../models/product");

/**
 * Get all products and render the product list view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getProducts = (req, res, next) => {
  // this will fetch all the products with sequelize
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));


};

/**
 * Get all products and render the index view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getIndex = (req, res, next) => {
  // this will fetch all the products with sequelize
  Product.fetchAll()
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
  req.user
    .getCart()
    .then((products) => {
      console.log(products);
      res.render("shop/cart", {
        docTitle: "Your Cart",
        path: "/cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
  // Cart.getCart((cart) => {
  //   // this will fetch the cart
  //   Product.fetchAll((products) => {
  //     // this will fetch all the products

  //     const cartProducts = []; // this will store the products in the cart

  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         (prod) => prod.id === product.id
  //       ); // this will find the product in the cart
  //       if (cartProductData) {
  //         // this will check if the product is in the cart
  //         //product.qty = cart.products.find(prod => prod.id === product.id).qty; // this will set the quantity of the product
  //         cartProducts.push({ productData: product, qty: cartProductData.qty }); // this will add the product to the cart
  //       }
  //     }

  //     res.render("shop/cart", {
  //       docTitle: "Your Cart",
  //       path: "/cart",
  //       products: cartProducts,
  //     });
  //   });
  // });
};

exports.postCart = async (req, res, next) => {

  const prodId = req.body.productId; // this will get the product id from the request body

  try{
    const product = await Product.findById(prodId); // this will store the product
    const result = await req.user.addToCart(product); // this will add the product to the cart
    console.log(result);
    res.redirect("/cart");

  }catch(error){
    console.log(error);
  }


  // try {
  //   const prodId = req.body.productId; // this will get the product id from the request body
  //   const cart = await req.user.getCart(); // this will store the cart
  //   const cartProduct = await cart.getProducts({ where: { id: prodId } }); // this will store the product in the cart
  //   const fetchedProduct = await Product.findByPk(prodId); // this will store the fetched product

  //   const product = cartProduct.length > 0 && cartProduct[0];
  //   let newQuantity = 1; // this will store the new quantity of the product

  //   if (product) {
  //     const oldQuantity = product.cartItem.quantity; // this will store the old quantity of the product
  //     newQuantity = oldQuantity + 1; // this will set the new quantity of the product
  //   }

  //   cart.addProduct(fetchedProduct, { through: { quantity: newQuantity } }); // this will add the product to the cart
  //   res.redirect("/cart");
  // } catch (err) {
  //   console.log(err);
  // }
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId; // this will get the product id from the request body
  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
  // Product.findById(prodId, (product) => {
  //   Cart.deleteProduct(prodId, +product.price); // this will delete the product from the cart
  //   res.redirect("/cart");
  // }); // this will get the product from the database
};

exports.postOrder = (req, res, next) => {

  let fetchedCart; // this will store the cart

  req.user
    .addOrder()
    .then(result => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

/**
 * Render the orders view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.getOrders = (req, res, next) => {
  req.user.getOrders() // this will get the orders associated with the user
    .then((orders) => {
      res.render("shop/orders", {
        docTitle: "Your Orders",
        path: "/orders",
        orders: orders
      });
    })
    .catch((err) => console.log(err));
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
  const prodId = req.params.productId; // this will get the product id from the request parameters

  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        docTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));

};
