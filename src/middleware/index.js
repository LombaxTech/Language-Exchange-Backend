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
} = require("./controller");

module.exports = function (app) {
  app.get("/custom-posts", getAllPosts(app));
  app.get("/custom-posts/paginate/:skip/:limit", getPaginatedAllPosts(app));
  app.get("/custom-posts/:language", getPostsOfLanguage(app));
  app.get("/custom-posts/user/:userId", getPosts(app));
  app.get("/custom-posts/user/:userId/:skip/:limit", getPaginatedPosts(app));
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

  app.post("/unfollow", async (req, res) => {
    // user is unfollowing partner
    const { userId, partnerId } = req.body;

    const User = createUserModel(app);

    try {
      let user = await User.findOne({ _id: userId });
      let partner = await User.findOne({ _id: partnerId });

      user.following.pull(partner._id);
      partner.followers.pull(user._id);
      // return res.json(result);

      let userResult = await user.save();
      let partnerResult = await partner.save();

      res.json({ userResult, partnerResult });
    } catch (error) {
      res.json(error);
    }
  });

  app.post("/custom-post/:postId/like", async (req, res) => {
    const Post = createPostModel(app);
    const { likerId } = req.body;
    const { postId } = req.params;
    try {
      let post = await Post.findOne({ _id: postId });
      if (post.likes.includes(likerId)) {
        // let like = post.likes.id(likerId);
        // return res.json(like);
        post.likes.pull(likerId);
        let result = await post.save();
        return res.json({ result });
      }

      post.likes.push(likerId);
      let result = await post.save();
      return res.json(result);
    } catch (error) {
      res.json(error);
    }
  });
};
