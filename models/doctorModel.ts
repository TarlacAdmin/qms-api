import mongoose, { Document, Schema } from "mongoose";

export interface DoctorModel extends Document {
  firstname: string;
  lastname: string;
  middlename?: string;
  suffix?: string;
  prefix?: string;
  degree?: string;
  metadata: {
    schedule: {
      monday: {
        start: string;
        end: string;
      };
      tuesday: {
        start: string;
        end: string;
      };
      wednesday: {
        start: string;
        end: string;
      };
      thursday: {
        start: string;
        end: string;
      };
      friday: {
        start: string;
        end: string;
      };
      saturday?: {
        start: string;
        end: string;
      };
      sunday?: {
        start: string;
        end: string;
      };
    };
  };
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
    metadata: {
      schedule: {
        monday: {
          start: String,
          end: String,
        },
        tuesday: {
          start: String,
          end: String,
        },
        wednesday: {
          start: String,
          end: String,
        },
        thursday: {
          start: String,
          end: String,
        },
        friday: {
          start: String,
          end: String,
        },
        saturday: {
          start: String,
          end: String,
        },
        sunday: {
          start: String,
          end: String,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<DoctorModel>("Doctor", doctorSchema);
