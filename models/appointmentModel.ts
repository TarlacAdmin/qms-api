import mongoose, { Document, Schema } from "mongoose";

export interface AppointmentModel extends Document {
  date: Date;
  patient: mongoose.Schema.Types.ObjectId;
  chiefComplaint?: string;
  doctor: mongoose.Schema.Types.ObjectId;
}

const apointmentSchema: Schema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    chiefComplaint: String,
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<AppointmentModel>("Appointment", apointmentSchema);
