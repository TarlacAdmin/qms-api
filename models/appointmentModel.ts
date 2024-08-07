import mongoose, { Document, Schema } from "mongoose";

export interface AppointmentModel extends Document {
  date: Date;
  firstname: string;
  lastname: string;
  middlename?: string;
  birthdate: Date;
  sex: string;
  civilStatus: ["Single", "Married", "Divorced", "Widowed"];
  religion?: string;
  contactNumber: string;
  barangay: string;
  city: string;
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
    firstname: {
      type: String,
      required: true,
      index: true,
    },
    lastname: {
      type: String,
      required: true,
      index: true,
    },
    middlename: {
      type: String,
      index: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
    civilStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      required: true,
    },
    religion: String,
    contactNumber: {
      type: String,
      required: true,
    },
    barangay: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
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
