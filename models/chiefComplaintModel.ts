import mongoose, { Schema, Document } from "mongoose";

export interface ChiefComplaintModel extends Document {
  text: string;
  onsetDateTime: Date;
  abatementDateTime: Date;
  bodySite?: string[];
  severity: string;
}

const chiefComplaintSchema: Schema = new Schema({
  text: {
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
  severity: {
    type: String,
    required: true,
  },
});

export default mongoose.model<ChiefComplaintModel>("ChiefComplaint", chiefComplaintSchema);
