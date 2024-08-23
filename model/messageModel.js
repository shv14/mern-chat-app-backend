const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: {
      text: { type: String, required: false },
      media: {
        type: String,
        required: false,
      },
      mediaType: {
        type: String,
        enum: ["image", "video"],
        required: false,
      }
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    read: {
      type: Boolean,
      default: false, 
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Messages", messageSchema);
