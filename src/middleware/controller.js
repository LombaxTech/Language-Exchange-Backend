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

exports.getPosts = (app) => async (req, res) => {
  const Post = createPostModel(app);
  const { userId } = req.params;
  try {
    let posts = await Post.find({ user: userId }).populate("user", "-password");
    res.json(posts);
  } catch (error) {
    res.json(error);
  }
};

exports.getPaginatedPosts = (app) => async (req, res) => {
  const Post = createPostModel(app);
  let { userId, skip, limit } = req.params;
  skip = parseInt(skip);
  limit = parseInt(limit);

  let posts = await Post.find({ user: userId })
    .populate("user", "-password")
    .limit(limit)
    .skip(skip);
  res.json(posts);
};

exports.getPaginatedAllPosts = (app) => async (req, res) => {
  const Post = createPostModel(app);
  let { skip, limit } = req.params;
  skip = parseInt(skip);
  limit = parseInt(limit);

  let posts = await Post.find()
    .populate("user", "-password")
    .limit(limit)
    .skip(skip);
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

exports.getOneChat = (app) => async (req, res) => {
  const Chat = createChatModel(app);
  const { chatId } = req.params;

  try {
    let chat = await Chat.findOne({ chatId }).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "profilePictureId _id",
      },
    });
    res.json(chat);
  } catch (error) {
    res.json(error);
  }
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

exports.getPostsOfLanguage = (app) => async (req, res) => {
  const { language } = req.params;
  const Post = createPostModel(app);

  try {
    let posts = await Post.find({ language }).populate("user");
    res.json(posts);
  } catch (error) {
    res.json(error);
  }
};

exports.likePost = (app) => async (req, res) => {
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
};

exports.sendMessage = (app) => async (req, res) => {
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
};

exports.follow = (app) => async (req, res) => {
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
};

exports.unfollow = (app) => async (req, res) => {
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
};

exports.comment = (app) => async (req, res) => {
  const Post = createPostModel(app);
  const { userId, text } = req.body;
  const { postId } = req.params;
  try {
    let post = await Post.findOne({ _id: postId });
    let comment = {
      text,
      user: userId,
    };
    post.comments.push(comment);
    let result = await post.save();
    return res.json(result);
  } catch (error) {
    res.json(error);
  }
};

exports.removeComment = (app) => async (req, res) => {
  const Post = createPostModel(app);
  const { commentId } = req.body;
  const { postId } = req.params;
  try {
    let post = await Post.findOne({ _id: postId });
    let comment = post.comments.id(commentId);
    comment.remove();
    let result = await post.save();
    return res.json(result);
  } catch (error) {
    res.json(error);
  }
};

exports.getPopulatedPost = (app) => async (req, res) => {
  const { postId } = req.params;
  const Post = createPostModel(app);
  try {
    let post = await Post.findOne({ _id: postId })
      .populate("user", "-password -createdAt -updatedAt -__v")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      });

    if (!post) return res.json({ error: "no post found" });
    res.json(post);
  } catch (error) {
    res.json(error);
  }
};
