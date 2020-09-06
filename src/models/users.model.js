// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "users";
  const mongooseClient = app.get("mongooseClient");
  const schema = new mongooseClient.Schema(
    {
      email: { type: String, unique: true, lowercase: true, required: true },
      password: { type: String, required: true },
      name: { type: String, required: true },
      nativeLanguage: { type: String, required: true },
      targetLanguage: { type: String, required: true },
      profilePictureId: String,
      following: [{ type: mongooseClient.ObjectId, ref: "users" }],
      followers: [{ type: mongooseClient.ObjectId, ref: "users" }],
      gender: { type: String },
      age: { type: Number },
      aboutMe: { type: String },
    },
    {
      timestamps: true,
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
