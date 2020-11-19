const createPostModel = require("../models/posts.model");
const createChatModel = require("../models/chat.model");
const createUserModel = require("../models/users.model");

const {
  getAllPosts,
  getPosts,
  getChats,
  getPopulatedUser,
  getPostsOfLanguage,
  getPaginatedPosts,
  getPaginatedAllPosts,
  likePost,
  getOneChat,
  sendMessage,
  follow,
  unfollow,
  comment,
  removeComment,
  getPopulatedPost,
} = require("./controller");

module.exports = function (app) {
  app.get("/custom-posts", getAllPosts(app));
  app.get("/custom-posts/paginate/:skip/:limit", getPaginatedAllPosts(app));
  app.get("/custom-posts/:language", getPostsOfLanguage(app));
  app.get("/custom-posts/user/:userId", getPosts(app));
  app.get("/custom-posts/user/:userId/:skip/:limit", getPaginatedPosts(app));
  app.get("/custom-chats/:userId", getChats(app));
  app.get("/custom-user/:userId", getPopulatedUser(app));
  app.get("/custom-chat/:chatId", getOneChat(app));
  app.post("/message", sendMessage(app));
  app.post("/follow", follow(app));
  app.post("/unfollow", unfollow(app));
  app.get("/custom-post/:postId", getPopulatedPost(app));
  app.post("/custom-post/:postId/like", likePost(app));
  app.post("/custom-post/:postId/comment", comment(app));
  app.post("/custom-post/:postId/comment/remove", removeComment(app));
};
