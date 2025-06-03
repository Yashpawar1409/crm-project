import mongoose from "mongoose";

const CommunicationLogSchema = new mongoose.Schema({
  custName: String,
  custEmail: String,
  status: String,
  timestamp: { type: Date, default: Date.now } // Add this line
});

const CommunicationLog = mongoose.model(
  "CommunicationLog",
  CommunicationLogSchema,
);



export default CommunicationLog;
