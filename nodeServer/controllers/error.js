exports.get404 = (req, res, next) => {
  //if it starts with /, it will execute this middleware. other routes must be on top
  //console.log('In the next middleware');
  //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  res
    .status(404)
    .render("404", {
      pageTitle: "Page Not Found",
      path: "",
      isAuthenticated: req.isLoggedIn,
    });
};
