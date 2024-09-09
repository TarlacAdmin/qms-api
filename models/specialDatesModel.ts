import mongoose, { Schema, Document } from "mongoose";

export interface SpecialDatesModel extends Document {
  name: string;
  date: string;
  attachment?: string;
}

const specialDatesSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  attachment: {
    type: String,
  },
});

export default mongoose.model<SpecialDatesModel>("SpecialDates", specialDatesSchema);
