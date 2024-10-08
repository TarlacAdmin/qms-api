import mongoose, { Document, Schema } from "mongoose";
import { CIVIL_STATUS } from "../config/config";

export interface PatientModel extends Document {
  patientType?: "new" | "existing";
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
    pinHole?: {
      right?: string;
      left?: string;
    };
    cc?: {
      right?: string;
      left?: string;
    };
    near?: {
      withCorrection?: string;
      withoutCorrection?: string;
    };
  };
  chiefComplaint?: {
    text: string;
    onsetDateTime: Date;
    abatementDateTime?: Date;
    bodySite?: string[];
    severity: string;
  }[];
  diagnosis?: {
    code: string;
    description: string;
    verificationStatus: string;
    category?: string[];
    severity: string;
    onsetDateTime: Date;
    abatementDateTime?: Date;
    bodySite?: string[];
    doctor?: string;
  }[];
  metadata: {
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

const patientSchema: Schema = new Schema(
  {
    patientType: {
      type: String,
      enum: ["new", "existing"],
    },
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
      pinHole: {
        right: String,
        left: String,
      },
      cc: {
        right: String,
        left: String,
      },
      near: {
        withCorrection: String,
        withoutCorrection: String,
      },
    },
    chiefComplaint: [
      {
        text: String,
        onsetDateTime: Date,
        abatementDateTime: Date,
        bodySite: [String],
        severity: String,
      },
    ],
    diagnosis: [
      {
        code: String,
        description: String,
        verificationStatus: String,
        category: [String],
        severity: String,
        onsetDateTime: Date,
        abatementDateTime: Date,
        bodySite: [String],
        doctor: String,
      },
    ],
    metadata: {
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
          date: Date,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// patientSchema.set("autoIndex", false);
export default mongoose.model<PatientModel>("Patient", patientSchema);
