const { required } = require("joi");
const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    ntnNo:{ type: String, required:true},
    mrNo: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
// userSchema.index({ "addresses.lat": 1, "addresses.lng": 1 }, { unique: true });

module.exports = mongoose.model("Users", userSchema, "Users");

