const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },

    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blog",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;

// kis user ne commnet daala hai aur kis blog ke liye comment daala hai hence we have required 2 id blog and user.
