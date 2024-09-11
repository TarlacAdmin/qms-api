import mongoose, { Document, Schema } from "mongoose";

export interface QueueModel extends Document {
  queueNumber: string;
  queueType: string;
  counter?: string;
  status?: string;
  timestamp: string | number;
  date: Date;
  metadata: {
    patient?: mongoose.Types.ObjectId;
    doctor?: mongoose.Types.ObjectId;
  };
}

const queueSchema: Schema = new Schema(
  {
    queueNumber: { type: String, required: true },
    queueType: {
      type: String,
      default: "walkin",
      index: true,
    },
    counter: {
      type: String,
      index: true,
    },
    status: {
      type: String,
      default: "new",
      index: true,
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
      doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
    },
  },
  {
    timestamps: true,
  }
);

// queueSchema.set("autoIndex", false);
export default mongoose.model<QueueModel>("Queue", queueSchema);
