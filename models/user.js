const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
 {
  username: { type: String },
  email: { type: String },
  googleId: { type: String },
 },
 {
  timestamps: true,
 },
);

module.exports = mongoose.model("User", userSchema);
