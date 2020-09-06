const createPostModel = require("../models/posts.model");
const createChatModel = require("../models/chat.model");
const createUserModel = require("../models/users.model");

exports.getAllPosts = (app) => async (req, res) => {
  const Post = createPostModel(app);
  let posts = await Post.find()
    // .limit(1)
    // .skip(2)
    .populate("user", "-password -createdAt");
  res.json(posts);
};

exports.getPost = (app) => async (req, res) => {
  const Post = createPostModel(app);

  const { userId } = req.params;

  let posts = await Post.find({ user: userId }).populate("user", "-password");
  res.json(posts);
};

exports.getChats = (app) => async (req, res) => {
  const { userId } = req.params;
  const Chat = createChatModel(app);

  let chats = await Chat.find({
    members: {
      $elemMatch: {
        $in: userId,
      },
    },
  }).populate("members");
  // .populate({
  //   path: "messages",
  //   populate: {
  //     path: "sender",
  //   },
  // });

  res.json(chats);
};

exports.getPopulatedUser = (app) => async (req, res) => {
  const { userId } = req.params;
  const User = createUserModel(app);

  try {
    let user = await User.findOne({ _id: userId }, "-password").populate(
      "followers following",
      "-password"
    );
    // .populate("following");
    res.json(user);
  } catch (error) {
    res.json(error);
  }
};
