const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');
const loginController = require('../controllers/loginController');
const messageController = require('../controllers/messageController');
const personalProfileController = require('../controllers/personalProfileController');
const userController = require('../controllers/userController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// hm is this right? multiple URLs... I guess so!
// will i need to protect all routes...? damn
router.get('/home/chat:chatid', chatController.get_chat_messages);


module.exports = router;
