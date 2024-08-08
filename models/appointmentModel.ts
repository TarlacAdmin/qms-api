import mongoose, { Document, Schema } from "mongoose";
import { CIVIL_STATUS } from "../config/config";

export interface AppointmentModel extends Document {
  date: Date;
  firstname: string;
  lastname: string;
  middlename?: string;
  birthdate: Date;
  sex: string;
  civilStatus: typeof CIVIL_STATUS;
  religion?: string;
  contactNumber: string;
  province?: string;
  city?: string;
  barangay?: string;
  streetNumber?: string;
  region?: string;
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
      enum: CIVIL_STATUS,
      required: true,
    },
    religion: String,
    contactNumber: {
      type: String,
      required: true,
    },
    province: {
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
    streetNumber: {
      type: String,
      required: true,
    },
    region: {
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
