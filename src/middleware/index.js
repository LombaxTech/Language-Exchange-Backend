const createPostModel = require("../models/posts.model");
const createChatModel = require("../models/chat.model");

const { getAllPosts, getPost, getChats } = require("./controller");

module.exports = function (app) {
  app.get("/custom-posts", getAllPosts(app));
  app.get("/custom-posts/:userId", getPost(app));
  app.get("/custom-chats/:userId", getChats(app));

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
};
