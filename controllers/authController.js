const asyncHandler = require("express-async-handler");

exports.isAuthenticated = asyncHandler( async( req, res, next ) => {
    console.log('checking if isAuthenticated')
    console.log(
        req.isAuthenticated()
    )

    next();

})