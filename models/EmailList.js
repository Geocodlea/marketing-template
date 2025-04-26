import mongoose from "mongoose";

global.models = global.models || {};

global.models.EmailList =
  global.models.EmailList ||
  mongoose.model("EmailList", {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Optional: specify the model that this ObjectId refers to
      unique: true,
    },
    contacts: [
      {
        email: {
          type: String,
          required: true,
          lowercase: true,
          trim: true,
        },
        prenume: {
          type: String,
          trim: true,
        },
        nume_familie: {
          type: String,
          trim: true,
        },
      },
      { _id: false },
    ],
  });

export default global.models.EmailList;
