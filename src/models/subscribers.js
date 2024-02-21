import mongoose from "mongoose";
import { getDate } from "../utils";
const Schema = mongoose.Schema;

const subSchema = new Schema(
  {
    subscriberID: { type: String, required: true, unique: true },
    subscriberAppName: { type: String, required: true },
    subscriberEmail: { type: String, required: true },
    subscriberHits: { type: Number, default: "0" },
    subscriberWebhookURL: { type: String, required: true },
    subscribed: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
exports.subs = subSchema;
export default mongoose.model("subs", subSchema);
