import { config } from "../config/config";
import { AppointmentModel } from "../models/appointmentModel";
import appointmentRepository from "../repository/appointmentRepository";
import patientService from "./patientService";

const appointmentService = {
  getById,
  getAllAppointments,
  create,
  update,
  remove,
  search,
  getTotalAppointments,
};

export default appointmentService;

async function getById(id: string, params: any): Promise<AppointmentModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.APPOINTMENT.INVALID_PARAMETER.GET);
  }

  try {
    let dbParams: any = { query: {}, options: {} };

    if (params.populateArray) {
      dbParams.options.populateArray = params.populateArray;
    }

    if (params.select) {
      if (!Array.isArray(params.select)) {
        params.select = [params.select];
      }
      dbParams.options.select = params.select.join(" ");
    }
    if (params.lean !== undefined) {
      dbParams.options.lean = params.lean;
    }

    return await appointmentRepository.getById(id, dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function getAllAppointments(params: any): Promise<AppointmentModel[]> {
  if (!params) {
    throw new Error(config.RESPONSE.ERROR.APPOINTMENT.INVALID_PARAMETER.GET_ALL);
  }

  try {
    let dbParams: any = { query: {}, options: {} };

    if (params.queryArray) {
      let queryArrayObj: { [key: string]: any } = {};
      queryArrayObj[params.queryArrayType] = params.queryArray;
      dbParams.query = { ...dbParams.query, ...queryArrayObj };
    }

    if (params.populateArray) {
      dbParams.options.populateArray = params.populateArray;
    }

    if (params.sort) {
      dbParams.options.sort = params.sort;
    }
    if (params.limit) {
      dbParams.options.limit = params.limit;
    }
    if (params.select) {
      if (!Array.isArray(params.select)) {
        params.select = [params.select];
      }
      dbParams.options.select = params.select.join(" ");
    }
    if (params.lean !== undefined) {
      dbParams.options.lean = params.lean;
    }

    return await appointmentRepository.getAllAppointments(dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function create(
  data: Partial<AppointmentModel> & { doctorId: string; patient: any }
): Promise<AppointmentModel> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.APPOINTMENT.INVALID_PARAMETER.CREATE);
  }

  try {
    const patient = await patientService.findOrCreate(data.patient);
    data.patient = patient._id;

    const appointment = await appointmentRepository.create(data);

    const addDoctorToAppointment = await appointmentRepository.addDoctorToAppointment(
      appointment._id as string,
      data.doctorId
    );

    if (!addDoctorToAppointment) {
      throw new Error(config.RESPONSE.ERROR.APPOINTMENT.FAILED);
    }

    return addDoctorToAppointment;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function update(data: Partial<AppointmentModel>): Promise<AppointmentModel | null> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.APPOINTMENT.INVALID_PARAMETER.UPDATE);
  }

  try {
    return await appointmentRepository.update(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function remove(id: string): Promise<AppointmentModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.APPOINTMENT.INVALID_PARAMETER.REMOVE);
  }

  try {
    return await appointmentRepository.remove(id);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function search(params: any): Promise<AppointmentModel[] | null> {
  try {
    let dbParams = {
      search: params.search,
      sort: params.sort || "-createdAt",
      project: params.project,
      limit: params.limit || 10,
    };
    return await appointmentRepository.search(dbParams);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getTotalAppointments(): Promise<{
  total: number;
  appointments: { [key: string]: number };
}> {
  try {
    return await appointmentRepository.getTotalAppointments();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
