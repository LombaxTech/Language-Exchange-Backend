const createPostModel = require("../models/posts.model");
const createChatModel = require("../models/chat.model");

module.exports = function (app) {
  app.get("/custom-posts", async (req, res) => {
    const Post = createPostModel(app);
    let posts = await Post.find()
      // .limit(1)
      // .skip(2)
      .populate("user", "-password -createdAt");
    res.json(posts);
  });

  app.get("/custom-posts/:userId", async (req, res) => {
    const Post = createPostModel(app);

    const { userId } = req.params;

    let posts = await Post.find({ user: userId }).populate("user", "-password");
    res.json(posts);
  });

  // app.post("/send-message", )
};
