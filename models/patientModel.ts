import mongoose, { Document, Schema } from "mongoose";

export interface PatientModel extends Document {
  firstname: string;
  middlename?: string;
  lastname: string;
  province?: string;
  city?: string;
  barangay?: string;
  streetNumber?: string;
  region?: string;
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
    firstname: {
      type: String,
      required: true,
      index: true,
    },
    middlelame: {
      type: String,
      required: true,
      index: true,
    },
    lastname: {
      type: String,
      required: true,
      index: true,
    },
    region: String,
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
