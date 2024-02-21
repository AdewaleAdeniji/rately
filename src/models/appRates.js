import mongoose from "mongoose";
const Schema = mongoose.Schema;

const appRateSchema = new Schema(
  {
    rate: { type: String, required: true },
    rateFrom: { type: String, required: true },
    rateTo: { type: String, required: true },
    rateAddedBy: { type: String, required: true },
    rateAppName: { type: String, required: true },
    rateID: { type: String, required: true, unique: true },
    date: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
exports.appRates = appRateSchema;
export default mongoose.model("app-rates", appRateSchema);