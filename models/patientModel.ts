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
  visualActivity: {
    rightEyeVisualActivity?: string;
    leftEyeVisualActivity?: string;
    pinHole?: string;
    cc?: string;
  };
}

const patientSchema: Schema = new Schema(
  {
    firstname: { type: String, required: true },
    middlename: { type: String, required: true },
    lastname: { type: String, required: true },
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
