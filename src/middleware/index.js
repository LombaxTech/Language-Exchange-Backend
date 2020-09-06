const createPostModel = require("../models/posts.model");
const createChatModel = require("../models/chat.model");
const createUserModel = require("../models/users.model");

const {
  getAllPosts,
  getPost,
  getChats,
  getPopulatedUser,
} = require("./controller");

module.exports = function (app) {
  app.get("/custom-posts", getAllPosts(app));
  app.get("/custom-posts/:userId", getPost(app));
  app.get("/custom-chats/:userId", getChats(app));
  app.get("/custom-user/:userId", getPopulatedUser(app));

  app.get("/custom-chat/:chatId", async (req, res) => {
    const { chatId } = req.params;
    const Chat = createChatModel(app);

    try {
      const chat = await Chat.findOne({ chatId })
        .populate("members")
        .populate({
          path: "messages",
          populate: {
            path: "sender",
          },
        });

      res.json(chat);
    } catch (error) {
      res.json(error);
    }
  });

  app.post("/message", async (req, res) => {
    const Chat = createChatModel(app);
    const { text, sender, chatId } = req.body;

    const message = { text, sender };

    try {
      const chat = await Chat.findOne({ chatId });
      chat.messages.push(message);

      let result = await chat.save();
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  });

  app.post("/follow", async (req, res) => {
    // user is following partner
    const { userId, partnerId } = req.body;

    const User = createUserModel(app);

    try {
      let user = await User.findOne({ _id: userId });
      let partner = await User.findOne({ _id: partnerId });

      user.following.push(partnerId);
      partner.followers.push(userId);

      let userResult = await user.save();
      let partnerResult = await partner.save();

      res.json({ userResult, partnerResult });
    } catch (error) {
      res.json(error);
    }
  });
};
