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
        am: string;
        pm: string;
      };
      tuesday: {
        am: string;
        pm: string;
      };
      wednesday: {
        am: string;
        pm: string;
      };
      thursday: {
        am: string;
        pm: string;
      };
      friday: {
        am: string;
        pm: string;
      };
      saturday?: {
        am: string;
        pm: string;
      };
      sunday?: {
        am: string;
        pm: string;
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
          am: String,
          pm: String,
        },
        tuesday: {
          am: String,
          pm: String,
        },
        wednesday: {
          am: String,
          pm: String,
        },
        thursday: {
          am: String,
          pm: String,
        },
        friday: {
          am: String,
          pm: String,
        },
        saturday: {
          am: String,
          pm: String,
        },
        sunday: {
          am: String,
          pm: String,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<DoctorModel>("Doctor", doctorSchema);
