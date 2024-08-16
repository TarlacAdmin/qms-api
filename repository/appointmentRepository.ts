import Appointment, { AppointmentModel } from "../models/appointmentModel";
import { ObjectId } from "mongodb";

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
  create,
  update,
  remove,
  findById,
  search,
  findByDate,
  addDoctorToAppointment,
  getTotalAppointments,
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

async function findById(id: string | ObjectId): Promise<AppointmentModel | null> {
  try {
    return await Appointment.findById(id).lean();
  } catch (error) {
    throw error;
  }
}

async function findByDate(date: Date): Promise<AppointmentModel | null> {
  try {
    return await Appointment.findOne({ date }).lean();
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

async function search(params: any = {}): Promise<AppointmentModel[]> {
  try {
    let aggregate = Appointment.aggregate();
    if (params.search) {
      aggregate.search(params.search);
    }
    if (params.match) {
      aggregate.match(params.match);
    }
    aggregate.project(params.project);
    aggregate.sort(params.sort);
    aggregate.limit(params.limit);
    return await aggregate.exec();
  } catch (error) {
    throw error;
  }
}

async function getTotalAppointments(): Promise<{
  total: number;
  appointments: { [key: string]: number };
}> {
  try {
    const total = await Appointment.countDocuments();
    const appointments = await Appointment.aggregate([
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
    ]);

    const appointmentsByDoctor: { [key: string]: number } = {};
    appointments.forEach((doc) => {
      appointmentsByDoctor[doc.doctor] = doc.count;
    });

    return { total, appointments: appointmentsByDoctor };
  } catch (error) {
    throw error;
  }
}
