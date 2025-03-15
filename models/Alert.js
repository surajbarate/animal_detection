import mongoose from "mongoose";

const alertSchema = mongoose.Schema({
  type: { type: String, required: true },
  timestamp: { type: Date, required: true },
  location: { type: String, required: true },
});

const Alert = mongoose.model("Alert", alertSchema);

export default Alert;