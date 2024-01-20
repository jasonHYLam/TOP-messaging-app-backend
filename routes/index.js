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
// will i need to protect all routes (except login/signup/logout)...? damn
// perhaps I could separate these routes into protectedRoutes and nonProtectedRoutes

// Login related routes.
router.post('/signup', loginController.signup);
router.post('/login', loginController.login);
router.post('/logout', loginController.logout);

// Chat related routes.
// Get specific chat's messages.
router.get('/home/chat/:chatid', chatController.get_chat_messages);
// Create new chat. Need to figure out what the route should be called.
router.post('/home/create_new_chat', chatController.create_new_chat);

// Message related routes.
router.post('/home/chat/:chatid/create_message', messageController.create_message)
router.delete('/home/chat/:chatid/:messageid', messageController.delete_message)
router.put('/home/chat/:chatid/:messageid', messageController.edit_message)
router.post('/home/chat/:chatid/reply_to_message', messageController.reply_to_message)
router.post('/home/chat/:chatid/react_to_message', messageController.react_to_message)
router.post('/home/chat/:chatid/attach_image', messageController.attach_image)



module.exports = router;
