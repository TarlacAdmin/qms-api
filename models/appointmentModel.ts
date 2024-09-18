import mongoose, { Document, Schema } from "mongoose";

export interface AppointmentModel extends Document {
  date: string;
  patient: mongoose.Schema.Types.ObjectId;
  doctor: mongoose.Schema.Types.ObjectId;
  status: "pending" | "done";
}

const apointmentSchema: Schema = new Schema(
  {
    date: {
      type: String,
      required: true,
      index: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    status: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<AppointmentModel>(
  "Appointment",
  apointmentSchema
);
