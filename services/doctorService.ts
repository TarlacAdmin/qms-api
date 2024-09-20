import { config } from "../config/config";
import { DoctorModel } from "../models/doctorModel";
import doctorRepository from "../repository/doctorRepository";

const doctorService = {
  getDoctor,
  getDoctors,
  createDoctor,
  updateDoctor,
  removeDoctor,
  searchDoctor,
};

export default doctorService;

async function getDoctor(id: string, params: any): Promise<DoctorModel | null> {
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

    return await doctorRepository.getDoctor(id, dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function getDoctors(params: any): Promise<DoctorModel[]> {
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

    return await doctorRepository.getDoctors(dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function createDoctor(data: Partial<DoctorModel>): Promise<DoctorModel> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.DOCTOR.INVALID_PARAMETER.CREATE);
  }

  try {
    return await doctorRepository.createDoctor(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function updateDoctor(data: Partial<DoctorModel>): Promise<DoctorModel | null> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.DOCTOR.INVALID_PARAMETER.UPDATE);
  }

  try {
    return await doctorRepository.updateDoctor(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function removeDoctor(id: string): Promise<DoctorModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.DOCTOR.INVALID_PARAMETER.REMOVE);
  }

  try {
    return await doctorRepository.removeDoctor(id);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function searchDoctor(params: any): Promise<DoctorModel[] | null> {
  try {
    let dbParams = {
      query: {},
      populateArray: [],
      options: {},
      lean: true,
      match: {},
    };
    dbParams.query = params.query;

    if (params.match) {
      dbParams.query = { ...dbParams.query, ...params.match };
    }

    //Build Populate Options
    if (params.populateArray) {
      dbParams["populateArray"] = params.populateArray;
    }

    //Build Query Options
    let optionsObj = {
      sort: "",
      skip: 0,
      select: "",
      limit: 0,
    };
    optionsObj["sort"] = params.sort || "-createdAt";
    optionsObj["skip"] = params.skip || 0;
    optionsObj["select"] = params.select || "_id";
    optionsObj["limit"] = params.limit || 10;
    dbParams.options = optionsObj;

    dbParams.lean = params.lean || true;

    return await doctorRepository.searchDoctor(dbParams);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
