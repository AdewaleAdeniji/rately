import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userID: {
      immutable: true,
      type: String,
      required: true,
    },
    userkeys: {
      default: {},
      type: Object,
    },
    hits: {
      default: "0",
      type: String,
    },
    apiWebhookSettings: {
      default: {
        webhookURL: "",
        webhookURLActive: false,
      },
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);
exports.users = userSchema;
module.exports = mongoose.model("users", userSchema);
