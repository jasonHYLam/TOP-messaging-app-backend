const express = require("express");
const router = express.Router();

const chatUtils = require("../helpers/chatUtils");

const authController = require("../controllers/authController");
const chatController = require("../controllers/chatController");
const loginController = require("../controllers/loginController");
const messageController = require("../controllers/messageController");
const personalProfileController = require("../controllers/personalProfileController");
const userController = require("../controllers/userController");

// Login related routes.
router.post(
  "/signup",
  authController.preventIfLoggedIn,
  loginController.signup
);
router.post("/login", authController.preventIfLoggedIn, loginController.login);
router.delete(
  "/logout",
  authController.preventIfLoggedOut,
  loginController.logout
);

// Chat related routes.
router.get(
  "/home/chat/:chatid",
  chatUtils.checkUserIsPartOfChat,
  chatController.get_chat_messages
);
router.get(
  "/home/get_chats_for_user",
  authController.isAuthenticated,
  chatController.get_chats_for_user
);
router.post("/home/create_new_chat", chatController.create_new_chat);
router.get(
  "/home/show_friends_for_initial_chat_creation",
  chatController.show_friends_for_initial_chat_creation
);
router.post(
  "/home/chat/:chatid/add_user/:userid",
  chatController.add_user_to_chat
);
router.get(
  "/home/chat/:chatid/show_friends_in_chat",
  chatController.show_friends_in_chat
);
router.post(
  "/home/chat/:chatid/change_chat_name",
  chatController.change_chat_name
);

// Message related routes.
router.post(
  "/home/chat/:chatid/create_message/:messageid?",
  messageController.validate_text,
  messageController.create_message
);
router.post(
  "/home/chat/:chatid/create_message_with_image/:messageid?",
  messageController.create_message_with_image
);
router.delete(
  "/home/chat/:chatid/:messageid",
  messageController.delete_message
);
router.put("/home/chat/:chatid/:messageid", messageController.edit_message);

// User related routes (viewing profiles, searching and adding users)
router.post("/home/user_profile/search", userController.search_user);
router.get("/home/user_profile/:userid", userController.get_user_profile);
router.post("/home/user_profile/:userid", userController.add_user);
router.get("/home/get_friends_list", userController.get_friends_list);
router.delete("/home/user_profile/:userid", userController.remove_friend);

// Personal profile related routes.
router.get(
  "/home/get_logged_in_user",
  personalProfileController.get_logged_in_user
);
router.put(
  "/home/personal_profile/change_description",
  personalProfileController.change_description
);
router.put(
  "/home/personal_profile/change_image",
  personalProfileController.change_image
);

module.exports = router;
