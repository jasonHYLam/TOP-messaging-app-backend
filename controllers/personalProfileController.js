const asyncHandler = require("express-async-handler");

const { upload } = require('../cloudinaryConfig')



const { body } = require('express-validator');
const he = require('he');

const User = require('../models/user');

// Will not bother with changing username and password.
// Regarding changing username, not sure how to deal with that logic.

exports.change_description = [
    // body(),
    asyncHandler(async (req, res, next) => {

    })
] 

exports.change_image = [
    // body(),
    asyncHandler(async (req, res, next) => {

        upload.single('profilePic')

        // need to get image URL, can i get it from req.file? or how do I access it through Cloudinary?

        res.json(req.file)

    })
] 