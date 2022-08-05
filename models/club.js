const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
 {
  userID: { type: Schema.Types.ObjectId, ref: "User" },
  membership: {
   type: String,
   enum: ["Open", "Waitlist", "Closed"],
   default: "Open",
  },
  annual_cost: {
   type: String,
   enum: ["$0 - $100", "$100 - $300", "$300 - $1000", "$1000+", "Unknown"],
   default: "Unknown",
  },
  rating: { type: Number, min: 1, max: 5, default: 3 },
  googleID: String,
 },
 {
  timestamps: true,
 },
);

const clubSchema = new Schema(
 {
  clubName: { type: String },
  website: { type: String },
  address: { type: String },
  googleID: { type: String },
  photos: { type: String },
  city: { type: String },
  lights: { type: Boolean },
  surface: {
   type: String,
   enum: ["Coated", "Asphalt", "Clay", "Unknown"],
   default: "Unknown",
  },
  membership: {
   type: String,
   enum: ["Open", "Waitlist", "Closed"],
   default: "Open",
  },
  annual_cost: {
   type: String,
   enum: ["$0 - $100", "$100 - $300", "$300 - $1000", "$1000+", "Unknown"],
   default: "Unknown",
  },
  courts: { type: Number, min: 0, max: 20 },
  longitude: { type: String },
  latitude: { type: String },

  reviews: [reviewSchema],
 },
 {
  timestamps: true,
 },
);

module.exports = mongoose.model("Club", clubSchema);
