import { config } from "../config/config";
import { AppointmentModel } from "../models/appointmentModel";
import appointmentRepository from "../repository/appointmentRepository";
import patientService from "./patientService";

const appointmentService = {
  getAppointment,
  getAppointments,
  getTotalAppointments,
  createAppointment,
  updateAppointment,
  removeAppointment,
  searchAppointment,
  searchAppointments,
};

export default appointmentService;

async function getAppointment(id: string, params: any): Promise<AppointmentModel | null> {
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

    return await appointmentRepository.getAppointment(id, dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function getAppointments(params: any): Promise<AppointmentModel[]> {
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

    return await appointmentRepository.getAppointments(dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function getTotalAppointments(): Promise<number[]> {
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

async function createAppointment(
  data: Partial<AppointmentModel> & { doctorId: string; patient: any }
): Promise<AppointmentModel> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.APPOINTMENT.INVALID_PARAMETER.CREATE);
  }

  try {
    const patient = await patientService.findOrCreate(data.patient);
    data.patient = patient._id;

    const appointment = await appointmentRepository.createAppointment(data);

    const addDoctorToAppointment = await appointmentRepository.setDoctorForAppointment(
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

async function updateAppointment(
  data: Partial<AppointmentModel>
): Promise<AppointmentModel | null> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.APPOINTMENT.INVALID_PARAMETER.UPDATE);
  }

  try {
    return await appointmentRepository.updateAppointment(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function removeAppointment(id: string): Promise<AppointmentModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.APPOINTMENT.INVALID_PARAMETER.REMOVE);
  }

  try {
    return await appointmentRepository.removeAppointment(id);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function searchAppointment(params: any): Promise<any[]> {
  try {
    if (!params.searchType) {
      throw new Error(config.RESPONSE.ERROR.APPOINTMENT.INVALID_PARAMETER.SEARCH);
    }

    const results = await appointmentRepository.searchAppointment(params);
    return results;
  } catch (error) {
    throw error;
  }
}

async function searchAppointments(params: any): Promise<AppointmentModel[] | null> {
  try {
    let dbParams: {
      query: Record<string, any>;
      populateArray: any[];
      options: Record<string, any>;
      lean: boolean;
      match: Record<string, any>;
      lookup: string | null;
      firstName?: string;
      lastName?: string;
      date?: string;
    } = {
      query: {},
      populateArray: [],
      options: {},
      lean: true,
      match: {},
      lookup: null,
    };
    dbParams.query = params.query || {};

    if (params.match) {
      dbParams.match = { ...dbParams.match, ...params.match };
    }

    if (params.firstName) {
      dbParams.match["patient.firstName"] = params.firstName;
    }
    if (params.lastName) {
      dbParams.match["patient.lastName"] = params.lastName;
    }
    if (params.date) {
      dbParams.match["date"] = params.date;
    }

    //Build Populate Options
    if (params.populateArray) {
      dbParams.populateArray = params.populateArray;
    }

    //Build Query Options
    dbParams.options = {
      sort: params.sort || "-createdAt",
      skip: params.skip || 0,
      select: params.select || "_id",
      limit: params.limit || 10,
    };

    dbParams.lean = params.lean !== undefined ? params.lean : true;

    if (params.lookup && (params.lookup === "patient" || params.lookup === "doctor")) {
      dbParams.lookup = params.lookup;
    }

    return await appointmentRepository.searchAppointments(dbParams);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
