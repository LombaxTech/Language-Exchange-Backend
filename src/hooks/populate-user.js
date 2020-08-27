// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { app, method, result, params } = context;

    const addUserInfo = async (post) => {
      const user = await app.service("users").get(post.userId, params);
      return {
        ...post,
        user,
      };
    };

    // if (method === "find") {
    //   context.result.data = await Promise.all(result.data.map(addUserInfo));
    // } else {
    //   context.result = await addUserInfo(result);
    // }

    return context.data;

    return context;
  };
};
