import mongoose from "mongoose";

global.models = global.models || {};

global.models.User =
  global.models.User ||
  mongoose.model("User", {
    email: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    phone: { type: String },
    plan: { type: String },
    planExpiresAt: { type: Date },
    subscriptionId: { type: String },
    customerId: { type: String },
    facebook: {
      adsRemaining: { type: Number, default: 0 },
      adAccountId: { type: String },
      pageId: { type: String },
    },
    brevoApiKey: { type: String },
  });

export default global.models.User;
