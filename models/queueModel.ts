import mongoose, { Document, Schema } from "mongoose";

export interface IQueue extends Document {
  queueNumber: string;
  counter?: string;
  status?: string;
  timestamp: string | number;
  metadata: {
    patient?: mongoose.Types.ObjectId;
    doctor?: string;
    bhw?: {
      profile: {
        firstname: string;
        lastname: string;
        middlename?: string;
        barangay: string;
        city: string;
      };
      label: string;
    }[];
  };
}

const queueSchema: Schema = new Schema(
  {
    queueNumber: { type: String, required: true },
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
        type: String,
        index: true,
      },
      bhw: [
        {
          profile: {
            firstname: String,
            lastname: String,
            middlename: String,
            barangay: String,
            city: String,
          },
          label: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// queueSchema.set("autoIndex", false);
export default mongoose.model<IQueue>("Queue", queueSchema);
