const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true
    },
    sender: {
      type: String,
      enum: ["user", "ai"],
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);