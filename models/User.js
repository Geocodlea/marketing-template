import mongoose from "mongoose";

global.models = global.models || {};

global.models.User =
  global.models.User ||
  mongoose.model("User", {
    firstname: { type: String },
    facebook: { type: Object },
  });

export default global.models.User;
