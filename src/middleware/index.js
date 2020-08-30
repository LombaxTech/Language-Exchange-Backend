const createPostModel = require("../models/posts.model");

module.exports = function (app) {
  app.get("/custom-posts", async (req, res) => {
    const Post = createPostModel(app);
    let posts = await Post.find()
      // .limit(1)
      // .skip(2)
      .populate("user", "-password -createdAt");
    res.json(posts);
  });
};
