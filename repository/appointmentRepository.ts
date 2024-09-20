import Appointment, { AppointmentModel } from "../models/appointmentModel";
import Patient from "../models/patientModel";
import Doctor from "../models/doctorModel";
import { SearchParams } from "../types/searchTypes";
import { buildSearchQuery, formatResults } from "../helper/searchHelpers";

import { PipelineStage } from "mongoose";

interface DbParams {
  query?: any;
  options?: {
    populateArray?: any[];
    select?: string;
    lean?: boolean;
    sort?: any;
    limit?: number;
  };
}

const appointmentRepository = {
  getAppointment,
  getAppointments,
  getTotalAppointments,
  createAppointment,
  updateAppointment,
  removeAppointment,
  searchAppointment,
  searchAppointments,
  setDoctorForAppointment,
};

export default appointmentRepository;

async function getAppointment(
  id: string,
  dbParams: DbParams = {}
): Promise<AppointmentModel | null> {
  let query = Appointment.findById(id);

  (dbParams.options?.populateArray || []).forEach((populateOption) => {
    query = query.populate(populateOption);
  });

  const options = {
    select: dbParams.options?.select || "_id",
    lean: dbParams.options?.lean || true,
  };

  query = query.select(options.select).lean(options.lean);

  return query.exec();
}

async function getAppointments(dbParams: DbParams = {}): Promise<AppointmentModel[]> {
  let query = Appointment.find(dbParams.query);

  (dbParams.options?.populateArray || []).forEach((populateOption) => {
    query = query.populate(populateOption);
  });

  const options = {
    sort: dbParams.options?.sort || {},
    limit: dbParams.options?.limit || 10,
    select: dbParams.options?.select || "_id",
    lean: dbParams.options?.lean || true,
  };

  query = query.sort(options.sort).limit(options.limit).select(options.select).lean(options.lean);

  return query.exec();
}

async function getTotalAppointments(): Promise<number[]> {
  return await Appointment.aggregate([
    {
      $facet: {
        totalAppointments: [
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              count: 1,
              _id: 0,
            },
          },
        ],

        totalAppointmentsByDoctor: [
          {
            $group: {
              _id: "$doctor",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              doctor: "$_id",
              count: 1,
              _id: 0,
            },
          },
          {
            $sort: { count: -1 },
          },
          // Optional - Populate doctor details
          {
            $lookup: {
              from: "doctors",
              localField: "doctor",
              foreignField: "_id",
              as: "doctor",
            },
          },
          {
            $unwind: "$doctor",
          },
          {
            $project: {
              doctor: {
                firstname: "$doctor.firstname",
                lastname: "$doctor.lastname",
                prefix: "$doctor.prefix",
                degree: "$doctor.degree",
              },
              count: 1,
            },
          },
        ],

        totalCurrentAppointmentsByDateWithDoctor: [
          {
            $match: {
              date: { $gte: new Date().toISOString().split("T")[0] },
            },
          },
          {
            $group: {
              _id: { doctor: "$doctor", date: "$date" },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              doctor: "$_id.doctor",
              date: "$_id.date",
              count: 1,
              _id: 0,
            },
          },
          {
            $sort: { date: 1 },
          },
          // Optional - Populate doctor details
          {
            $lookup: {
              from: "doctors",
              localField: "doctor",
              foreignField: "_id",
              as: "doctor",
            },
          },
          {
            $unwind: "$doctor",
          },
          {
            $project: {
              doctor: {
                firstname: "$doctor.firstname",
                lastname: "$doctor.lastname",
                prefix: "$doctor.prefix",
                degree: "$doctor.degree",
              },
              date: 1,
              count: 1,
            },
          },
        ],
      },
    },
  ]);
}

async function createAppointment(data: Partial<AppointmentModel>): Promise<AppointmentModel> {
  return await Appointment.create(data);
}

async function updateAppointment(
  data: Partial<AppointmentModel>
): Promise<AppointmentModel | null> {
  return await Appointment.findByIdAndUpdate(data._id, data, { new: true }).lean();
}

async function removeAppointment(id: string): Promise<AppointmentModel | null> {
  return await Appointment.findByIdAndDelete(id).lean();
}

async function searchAppointment(params: SearchParams): Promise<any> {
  const searchTypes =
    params.searchType === "all" || !params.searchType
      ? ["patient", "doctor", "appointment"]
      : [params.searchType];

  const searchPromises = searchTypes.map(async (type) => {
    let query;
    switch (type) {
      case "patient":
        query = buildSearchQuery(Patient, { ...params, populateArray: undefined });
        break;
      case "doctor":
        query = buildSearchQuery(Doctor, { ...params, populateArray: undefined });
        break;
      case "appointment":
        query = buildSearchQuery(Appointment, params);
        break;
      default:
        return { type, results: [] };
    }

    const results = await query.exec();
    return { type, results };
  });

  const searchResults = await Promise.all(searchPromises);

  return formatResults(searchResults, params.searchType);
}

async function searchAppointments(params: any = {}): Promise<AppointmentModel[]> {
  const pipeline: PipelineStage[] = [];

  // Add lookup and unwind for patient or doctor
  if (params.lookup) {
    pipeline.push({
      $lookup: {
        from: params.lookup === "patient" ? "patients" : "doctors",
        localField: params.lookup,
        foreignField: "_id",
        as: params.lookup,
      },
    } as PipelineStage);
    pipeline.push({ $unwind: `$${params.lookup}` } as PipelineStage);
  }

  // Add match stage
  const matchStage: Record<string, any> = { ...params.match };

  // Only add status filter if it's provided in the params
  if (params.status) {
    matchStage.status = params.status;
  }

  // Only add the match stage if there are any conditions
  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage } as PipelineStage);
  }

  // Add sort stage
  if (params.options.sort) {
    const sortField = params.options.sort.replace("-", "");
    const sortOrder = params.options.sort.startsWith("-") ? -1 : 1;
    pipeline.push({ $sort: { [sortField]: sortOrder } } as PipelineStage);
  }

  // Add skip stage
  if (params.options.skip) {
    pipeline.push({ $skip: params.options.skip } as PipelineStage);
  }

  // Add limit stage
  if (params.options.limit) {
    pipeline.push({ $limit: params.options.limit } as PipelineStage);
  }

  // Add project stage for select
  if (params.options.select) {
    const selectFields = params.options.select
      .split(" ")
      .reduce((acc: Record<string, 1>, field: string) => {
        acc[field] = 1;
        return acc;
      }, {});
    pipeline.push({ $project: selectFields } as PipelineStage);
  }

  return Appointment.aggregate(pipeline);
}

async function setDoctorForAppointment(
  appointmentId: string,
  doctorId: string
): Promise<AppointmentModel | null> {
  return await Appointment.findByIdAndUpdate(
    appointmentId,
    {
      $set: {
        doctor: doctorId,
      },
    },
    {
      new: true,
    }
  ).lean();
}
