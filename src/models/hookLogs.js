// schema for hooklogs
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hookLogSchema = new Schema(
  {
    hookID: { type: String, required: true, unique: true },
    rate: { type: Object, required: true, default: {} },
    failedSubscribers: { type: Array, default: [] },
    successfulSubscribers: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);

exports.hookLogs = hookLogSchema;
export default mongoose.model("hook-logs", hookLogSchema);