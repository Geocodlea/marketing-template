import mongoose from "mongoose";

global.models = global.models || {};

global.models.User =
  global.models.User ||
  mongoose.model("User", {
    email: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    phone: { type: String },
    stripe: {
      customerId: { type: String },
      subscriptionId: { type: String },
    },
    plan: { type: String },
    planExpiresAt: { type: Date },
    facebook: {
      accessToken: { type: String },
      pageId: { type: String },
      adAccountId: { type: String },
      adsRemaining: { type: Number, default: 0 },
    },
    brevo: {
      email: { type: String },
      name: { type: String },
    },
    newsletterEmail: { type: String },
  });

export default global.models.User;
