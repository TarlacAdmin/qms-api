import mongoose, { Schema, Document } from "mongoose";

export interface DiagnosisModel extends Document {
  code: string;
  description: string;
  clinicalStatus: string;
  verificationStatus: string;
  category?: string[];
  severity: string;
  onsetDateTime: Date;
  abatementDateTime?: Date;
  bodySite?: string[];
}

const diagnosisSchema: Schema = new Schema({
  code: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  clinicalStatus: {
    type: String,
    required: true,
  },
  verificationStatus: {
    type: String,
    required: true,
  },
  category: [
    {
      type: String,
    },
  ],
  severity: {
    type: String,
    required: true,
  },
  onsetDateTime: {
    type: Date,
    required: true,
  },
  abatementDateTime: Date,
  bodySite: [
    {
      type: String,
    },
  ],
});

export default mongoose.model<DiagnosisModel>("Diagnosis", diagnosisSchema);
