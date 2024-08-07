import mongoose, { Document, Schema } from "mongoose";

export interface DoctorModel extends Document {
  firstname: string;
  lastname: string;
  middlename?: string;
  suffix?: string;
  prefix?: string;
  degree?: string;
}

const doctorSchema: Schema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      index: true,
    },
    lastname: {
      type: String,
      required: true,
      index: true,
    },
    middlename: {
      type: String,
      index: true,
    },
    suffix: String,
    prefix: String,
    degree: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<DoctorModel>("Doctor", doctorSchema);
