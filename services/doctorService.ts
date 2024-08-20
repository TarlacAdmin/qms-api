import { config } from "../config/config";
import { DoctorModel } from "../models/doctorModel";
import doctorRepository from "../repository/doctorRepository";

const doctorService = {
  getById,
  getAllDoctors,
  create,
  update,
  remove,
  search,
};

export default doctorService;

async function getById(id: string, params: any): Promise<DoctorModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.DOCTOR.INVALID_PARAMETER.GET);
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

    return await doctorRepository.getById(id, dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function getAllDoctors(params: any): Promise<DoctorModel[]> {
  if (!params) {
    throw new Error(config.RESPONSE.ERROR.DOCTOR.INVALID_PARAMETER.GET_ALL);
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

    return await doctorRepository.getAllDoctors(dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function create(data: Partial<DoctorModel>): Promise<DoctorModel> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.DOCTOR.INVALID_PARAMETER.CREATE);
  }

  try {
    if (data.metadata && data.metadata.schedule) {
      data.metadata.schedule = parseSchedule(data.metadata.schedule);
    }
    return await doctorRepository.create(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function update(data: Partial<DoctorModel>): Promise<DoctorModel | null> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.DOCTOR.INVALID_PARAMETER.UPDATE);
  }

  try {
    return await doctorRepository.update(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function remove(id: string): Promise<DoctorModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.DOCTOR.INVALID_PARAMETER.REMOVE);
  }

  try {
    return await doctorRepository.remove(id);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function search(params: any): Promise<DoctorModel[] | null> {
  try {
    let dbParams = {
      search: params.search,
      sort: params.sort || "-createdAt",
      project: params.project,
      limit: params.limit || 10,
    };
    return await doctorRepository.search(dbParams);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function parseSchedule(schedule: any): any {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const parsedSchedule: any = {};

  days.forEach((day) => {
    if (schedule[day]) {
      parsedSchedule[day] = {
        am: schedule[day].am ? schedule[day].am : false,
        pm: schedule[day].pm ? schedule[day].pm : false,
      };
    } else {
      parsedSchedule[day] = {
        am: false,
        pm: false,
      };
    }
  });

  return parsedSchedule;
}
