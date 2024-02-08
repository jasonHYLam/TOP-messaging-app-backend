const asyncHandler = require("express-async-handler");

const { upload } = require('../cloudinaryConfig')



const { body } = require('express-validator');
const he = require('he');

const User = require('../models/user');

// Will not bother with changing username and password.
// Regarding changing username, not sure how to deal with that logic.

exports.change_description = [
    body('changeToSubmit').trim().escape(),

    asyncHandler(async (req, res, next) => {
        // should get userid from req.user.id
        console.log('checking changeToSubmit')
        console.log(req.body)

        await User.findByIdAndUpdate(req.user.id, {
            description: he.decode(req.body.changeToSubmit)
        })

        res.json({})
    })
] 

exports.change_image = [

    upload.single('profilePic'),

    asyncHandler(async (req, res, next) => {

        // I have no idea how this works.
        // upload.single('profilePic')
        console.log('checking change_image')
        console.log('req.file:')
        console.log(req.file)

        await User.findByIdAndUpdate(req.user.id, {
            profilePicURL: req.file.path,
            imageID: req.file.fieldname
        })
        // need to get image URL, can i get it from req.file? or how do I access it through Cloudinary?

        // res.json(req.file)
        res.json({})
        // modify User document.

    })
] 