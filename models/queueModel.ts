import mongoose, { Document, Schema } from "mongoose";

export interface IQueue extends Document {
  queueNumber: string;
  counter?: string;
  status?: string;
  timestamp: string | number;
  metadata: {
    patient?: mongoose.Types.ObjectId;
  };
}

const queueSchema: Schema = new Schema(
  {
    queueNumber: { type: String, required: true },
    counter: String,
    status: {
      type: String,
      default: "new",
    },
    timestamp: {
      type: Schema.Types.Mixed,
      required: true,
      default: Date.now,
    },
    metadata: {
      patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
      doctor: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IQueue>("Queue", queueSchema);
