import mongoose from "mongoose";

global.models = global.models || {};

global.models.User =
  global.models.User ||
  mongoose.model("User", {
    email: { type: String, required: true, unique: true },
    firstname: { type: String },
    plan: { type: String, default: "free" },
    planExpiresAt: { type: Date },
    facebook: { type: Object },
  });

export default global.models.User;
