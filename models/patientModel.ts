import mongoose, { Document, Schema } from "mongoose";

export interface PatientModel extends Document {
  firstName: string;
  middleName: string;
  lastName: string;
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
    firstName: { 
      type: String, 
      required: true,
      index: true
    },
    middleName: { 
      type: String,
      required: true,
      index: true
    },
    lastName: { 
      type: String, 
      required: true,
      index: true
    },
    province: String,
    city: String,
    barangay: String,
    streetNumber: String,
    birthday: Date,
    religion: String,
    civilStatus: String,
    cellphoneNumber: String,
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
