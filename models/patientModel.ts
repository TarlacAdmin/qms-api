import mongoose, { Document, Schema } from "mongoose";

export interface PatientModel extends Document {
  patient: {
    name: {
      firstName: string;
      middleName?: string;
      lastName: string;
    };
    address: {
      streetNo?: string;
      barangay: string;
      city: string;
      province: string;
    };
    birthday: string;
    civilStatus: string;
    religion: string;
    cellphoneNumber: string;
    emr: {
      doctor?: {
        name: string;
        schedule: string;
      };
      vitals?: {
        height: string;
        weight: string;
      };
      visualAcuity?: {
        right: string;
        left: string;
        pinhole?: string;
        cc?: string;
      };
      operation?: {
        eye: {
          firstOperation: {
            leftEye: boolean;
            rightEye: boolean;
            date: string;
          };
          secondOperation: {
            leftEye: boolean;
            rightEye: boolean;
            date: string;
          };
        };
      };
    };
  };
  bhw: {
    idNumber: string;
    name: string;
    address: {
      barangay: string;
      city: string;
    };
  };
}

const patientSchema: Schema = new Schema({
  patient: {
    name: {
      firstName: { type: String, required: true },
      middleName: { type: String },
      lastName: { type: String, required: true },
    },
    address: {
      streetNo: { type: String },
      barangay: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
    },
    birthday: { type: String, required: true },
    civilStatus: { type: String, required: true },
    religion: { type: String, required: true },
    cellphoneNumber: { type: String, required: true },
    emr: {
      doctor: {
        name: { type: String },
        schedule: { type: String },
      },
      vitals: {
        height: { type: String },
        weight: { type: String },
      },
      visualAcuity: {
        right: { type: String },
        left: { type: String },
        pinhole: { type: String },
        cc: { type: String },
      },
      operation: {
        eye: {
          firstOperation: {
            leftEye: { type: Boolean },
            rightEye: { type: Boolean },
            date: { type: String },
          },
          secondOperation: {
            leftEye: { type: Boolean },
            rightEye: { type: Boolean },
            date: { type: String },
          },
        },
      },
    },
  },
  bhw: {
    idNumber: { type: String },
    name: { type: String },
    address: {
      barangay: { type: String },
      city: { type: String },
    },
  },
});

export default mongoose.model<PatientModel>("Patient", patientSchema);
