import mongoose, { Document, Schema } from "mongoose";
import { CIVIL_STATUS } from "../config/config";

export interface PatientModel extends Document {
  firstName: string;
  lastName: string;
  middleName?: string;
  birthdate?: Date;
  sex: string;
  civilStatus?: typeof CIVIL_STATUS;
  religion?: string;
  cellphoneNumber?: string;
  province?: string;
  city?: string;
  barangay?: string;
  streetNumber?: string;
  region?: string;
  visualAcuity?: {
    right?: string;
    left?: string;
    pinHole?: string;
    cc?: string;
  };
}

const patientSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      index: true,
    },
    lastName: {
      type: String,
      required: true,
      index: true,
    },
    middleName: {
      type: String,
      index: true,
    },
    birthdate: Date,
    sex: String,
    civilStatus: {
      type: String,
      enum: CIVIL_STATUS,
    },
    religion: String,
    cellphoneNumber: String,
    province: String,
    city: String,
    barangay: String,
    streetNumber: String,
    region: String,
    visualAcuity: {
      right: String,
      left: String,
      pinHole: String,
      cc: String,
    },
  },
  {
    timestamps: true,
  }
);

// patientSchema.set("autoIndex", false);
export default mongoose.model<PatientModel>("Patient", patientSchema);
