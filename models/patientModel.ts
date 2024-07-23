import mongoose, { Document, Schema } from "mongoose";

export interface PatientModel extends Document {
  firstname: string;
  middlename: string;
  lastname: string;
  province?: string;
  city?: string;
  barangay?: string;
  streetNumber?: string;
  birthdate?: Date;
  religion?: string;
  civilStatus?: string;
  cellphoneNumber?: string;
  visualAcuity: {
    right?: string;
    left?: string;
    pinHole?: string;
    cc?: string;
  };
}

const patientSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String, required: true },
    lastName: { type: String, required: true },
    province: String,
    city: String,
    barangay: String,
    streetNumber: String,
    birthdate: Date,
    religion: String,
    civilStatus: String,
    cellphoneNumber: String,
    visualAcvitiy: {
      rightEyeVisualActivity: String,
      leftEyeVisualActivity: String,
      pinHole: String,
      cc: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<PatientModel>("Patient", patientSchema);
