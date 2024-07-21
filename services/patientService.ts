import { config } from "../config/config";
import { ObjectId } from "bson";
import { PatientModel } from "../models/patientModel";
import patientRepository from "../repository/patientRepository";

const patientService = {
  getById,
  getAllPatients,
  create,
  update,
  remove,
  search,
  findOrCreate,
};

export default patientService;

async function getById(id: string, params: any): Promise<PatientModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.PATIENT.INVALID_PARAMETER.GET);
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

    return await patientRepository.getById(id, dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function getAllPatients(params: any): Promise<PatientModel[]> {
  if (!params) {
    throw new Error(config.RESPONSE.ERROR.PATIENT.INVALID_PARAMETER.GET_ALL);
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

    return await patientRepository.getAllPatients(dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function findOrCreate(patientData: Partial<PatientModel> | ObjectId): Promise<PatientModel> {
  if (patientData instanceof ObjectId) {
    const patient = await patientRepository.findById(patientData);
    if (!patient) {
      throw new Error("Patient not found");
    }
    return patient;
  } else {
    let patient = await patientRepository.findOne({ _id: patientData._id });
    if (!patient) {
      patient = await patientRepository.create(patientData);
    }
    return patient;
  }
}

async function create(data: Partial<PatientModel>): Promise<PatientModel> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.PATIENT.INVALID_PARAMETER.CREATE);
  }

  try {
    return await patientRepository.create(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function update(data: Partial<PatientModel>): Promise<PatientModel | null> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.PATIENT.INVALID_PARAMETER.UPDATE);
  }

  try {
    return await patientRepository.update(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function remove(id: string): Promise<PatientModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.PATIENT.INVALID_PARAMETER.REMOVE);
  }

  try {
    return await patientRepository.remove(id);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function search(params: any): Promise<PatientModel[] | null> {
  try {
    let dbParams = {
      query: {},
      populateArray: [],
      options: {},
      lean: true,
    };
    dbParams.query = params.query;

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

    return await patientRepository.search(dbParams);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
