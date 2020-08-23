// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { app, method, result, params } = context;
    console.log(method);

    const addUserInfo = async (post) => {
      console.log("function running");
      console.log(post.userId);
      const user = await app.service("users").get(post.userId, params);
      console.log("function still running");
      return {
        ...post,
        user,
      };
    };

    if (method === "find") {
      context.result.data = await Promise.all(result.data.map(addUserInfo));
      console.log("ran");
    } else {
      context.result = await addUserInfo(result);
    }

    return context;
  };
};
