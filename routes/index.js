const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const chatController = require('../controllers/chatController');
const loginController = require('../controllers/loginController');
const messageController = require('../controllers/messageController');
const personalProfileController = require('../controllers/personalProfileController');
const userController = require('../controllers/userController');

// hm is this right? multiple URLs... I guess so!
// will i need to protect all routes (except login/signup/logout)...? damn
// perhaps I could separate these routes into protectedRoutes and nonProtectedRoutes

// Login related routes.
router.post('/signup', loginController.signup);
router.post('/login', loginController.login);

router.post('/logout', loginController.logout);

// Chat related routes.
// Get specific chat's messages.
// router.get('/home/chat/:chatid', authController.isAuthenticated, chatController.get_chat_messages);
router.get('/home/chat/:chatid',  chatController.get_chat_messages);
// Get all chats to display in sidebar.
// router.get('/home/get_all_chats', authController.isAuthenticated, chatController.get_all_chats);
router.get('/home/get_chats_for_user', authController.isAuthenticated, chatController.get_chats_for_user);
// router.get('/home/get_all_chats', chatController.get_all_chats);
// Create new chat. Need to figure out what the route should be called.
router.post('/home/create_new_chat', chatController.create_new_chat);
router.get('/home/show_friends_for_chat', chatController.show_friends_for_chat);


// Message related routes.
router.post('/home/chat/:chatid/create_message', messageController.create_message)
router.delete('/home/chat/:chatid/:messageid', messageController.delete_message)
router.put('/home/chat/:chatid/:messageid', messageController.edit_message)
router.post('/home/chat/:chatid/reply_to_message', messageController.reply_to_message)
router.post('/home/chat/:chatid/react_to_message', messageController.react_to_message)
router.post('/home/chat/:chatid/attach_image', messageController.attach_image)

// User related routes (viewing profiles, searching and adding users)
// Searching user. How is this gonna work? Post? Get? Possibly get the userID from button from user
// this should probably be changed from post to get
router.post('/home/user_profile/search', userController.search_user)
router.get('/home/user_profile/:userid', userController.get_user_profile)
router.post('/home/user_profile/:userid', userController.add_user)
router.get('home/count_online_number', userController.count_online_number)
router.get('home/count_friends_number', userController.count_friends_number)

// Personal profile related routes.
router.get('/home/get_logged_in_user', personalProfileController.get_logged_in_user)
router.put('/home/personal_profile/change_description', personalProfileController.change_description)
router.put('/home/personal_profile/change_image', personalProfileController.change_image)

module.exports = router;
