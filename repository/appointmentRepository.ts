import Appointment, { AppointmentModel } from "../models/appointmentModel";
import Patient from "../models/patientModel";
import Doctor from "../models/doctorModel";
import { ObjectId } from "mongodb";
import { SearchParams } from "../types/searchTypes";
import { buildSearchQuery, formatResults } from "../helper/searchHelpers";

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
  getById,
  getAllAppointments,
  getTotalAppointments,
  create,
  update,
  remove,
  search,
  addDoctorToAppointment,
};

export default appointmentRepository;

async function getById(id: string, dbParams: DbParams = {}): Promise<AppointmentModel | null> {
  try {
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
  } catch (error) {
    throw error;
  }
}

async function getAllAppointments(dbParams: DbParams = {}): Promise<AppointmentModel[]> {
  try {
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
  } catch (error) {
    throw error;
  }
}

async function create(data: Partial<AppointmentModel>): Promise<AppointmentModel> {
  try {
    return await Appointment.create(data);
  } catch (error) {
    throw error;
  }
}

async function addDoctorToAppointment(
  appointmentId: string,
  doctorId: string
): Promise<AppointmentModel | null> {
  try {
    return await Appointment.findByIdAndUpdate(
      {
        _id: appointmentId,
      },
      {
        $set: {
          doctor: doctorId,
        },
      },
      {
        new: true,
      }
    ).lean();
  } catch (error) {
    throw error;
  }
}

async function update(data: Partial<AppointmentModel>): Promise<AppointmentModel | null> {
  try {
    return await Appointment.findByIdAndUpdate(data._id, data, { new: true }).lean();
  } catch (error) {
    throw error;
  }
}

async function remove(id: string): Promise<AppointmentModel | null> {
  try {
    return await Appointment.findByIdAndDelete(id).lean();
  } catch (error) {
    throw error;
  }
}

// Purpose: Search for patients, doctors, and appointments
async function search(params: SearchParams): Promise<any> {
  try {
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
  } catch (error) {
    console.error("Repository search error:", error);
    throw error;
  }
}

async function getTotalAppointments(): Promise<number[]> {
  try {
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
  } catch (error) {
    throw error;
  }
}
