exports.get404 = (req, res, next) => {
  //if it starts with /, it will execute this middleware. other routes must be on top
  //console.log('In the next middleware');
  //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  res
    .status(404)
    .render("404", {
      pageTitle: "Page Not Found",
      path: "/404",
      isAuthenticated: req.session.isLoggedIn,
    });
};


exports.get500 = (req, res, next) => {
  //if it starts with /, it will execute this middleware. other routes must be on top
  //console.log('In the next middleware');
  //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  res
    .status(500)
    .render("500", {
      pageTitle: "An Error Ocurred!",
      path: "/500",
      isAuthenticated: req.session.isLoggedIn,
    });
};

