const asyncHandler = require("express-async-handler");

const { upload } = require('../cloudinaryConfig')



const { body } = require('express-validator');
const he = require('he');

const User = require('../models/user');

// Will not bother with changing username and password.
// Regarding changing username, not sure how to deal with that logic.

exports.change_description = [
    body('description').trim().escape(),

    asyncHandler(async (req, res, next) => {
        // should get userid from req.user.id

        // Need to test this.
        // Do I need to await this?
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            description: he.decode(req.body.description)
        })
        res.json({updatedUser})
    })
] 

exports.change_image = [
    // body(),
    asyncHandler(async (req, res, next) => {

        // I have no idea how this works.
        upload.single('profilePic')

        // need to get image URL, can i get it from req.file? or how do I access it through Cloudinary?

        res.json(req.file)
        // modify User document.

    })
] 