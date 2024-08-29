import mongoose, { Schema, Document } from "mongoose";

export interface SpecialDatesModel extends Document {
  name: string;
  date: Date;
  attachment?: string;
}

const specialDatesSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  attachment: {
    type: String,
  },
});

export default mongoose.model<SpecialDatesModel>("SpecialDates", specialDatesSchema);
