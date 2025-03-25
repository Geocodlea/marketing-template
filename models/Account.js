import mongoose from "mongoose";

global.models = global.models || {};

global.models.Account =
  global.models.Account ||
  mongoose.model("Account", {
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true, unique: true },
    type: { type: String },
    refresh_token: { type: String },
    access_token: { type: String },
    expires_at: { type: Number },
    token_type: { type: String },
    scope: { type: String },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Optional: specify the model that this ObjectId refers to
    },
  });

export default global.models.Account;
