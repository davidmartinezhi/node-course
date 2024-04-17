const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    // Check if the Authorization header is set
    if(!req.get("Authorization")){
        const error = new Error("Not authenticated.");
        error.statusCode = 401;
        throw error;
    }

    // Extract the token from the request header. we split to get value after 'Bearer'
    const token = req.get("Authorization").split(" ")[1];

    // Decode the token
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, "somesupersecretsecret"); //secret must be the same as the one used to sign the token
    }catch(err){
        err.statusCode = 500;
        throw err;
    }

    // If the token is undefined it didnt failed to decode, but failed to authenticate
    if(!decodedToken){
        const error = new Error("Not authenticated.");
        error.statusCode = 401;
        throw error;
    }

    // If the token is valid, we store the userId in the request object
    // This way we can use it in the next middlewares
    req.userId = decodedToken.userId;

    next(); // this will pass the request to the next middleware
};