import { config } from "../config/config";
import { PatientModel } from "../models/patientModel";
import patientRepository from "../repository/patientRepository";

const patientService = {
  getPatient,
  getPatients,
  createPatient,
  updatePatient,
  removePatient,
  searchPatient,
  findOrCreate,
  addToSetChiefComplaint,
  addToSetDiagnosis,
};

export default patientService;

async function getPatient(id: string, params: any): Promise<PatientModel | null> {
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

    return await patientRepository.getPatient(id, dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function getPatients(params: any): Promise<PatientModel[]> {
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

    return await patientRepository.getPatients(dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function createPatient(data: Partial<PatientModel>): Promise<PatientModel> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.PATIENT.INVALID_PARAMETER.CREATE);
  }

  try {
    return await patientRepository.createPatient(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function updatePatient(data: Partial<PatientModel>): Promise<PatientModel | null> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.PATIENT.INVALID_PARAMETER.UPDATE);
  }

  try {
    return await patientRepository.updatePatient(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function removePatient(id: string): Promise<PatientModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.PATIENT.INVALID_PARAMETER.REMOVE);
  }

  try {
    return await patientRepository.removePatient(id);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function searchPatient(params: any): Promise<PatientModel[] | null> {
  try {
    let dbParams = {
      search: params.search,
      sort: params.sort || "-createdAt",
      project: params.project,
      limit: params.limit || 10,
    };
    return await patientRepository.searchPatient(dbParams);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function findOrCreate(patientQueryOrData: any): Promise<PatientModel> {
  const query = patientQueryOrData._id
    ? { _id: patientQueryOrData._id }
    : {
        firstName: patientQueryOrData.firstName,
        lastName: patientQueryOrData.lastName,
      };

  let patient = await patientRepository.findOrCreate(query);
  if (!patient) {
    patient = await patientRepository.createPatient(patientQueryOrData as Partial<PatientModel>);
  }
  return patient;
}

async function addToSetChiefComplaint(params: {
  _id: string;
  chiefComplaint: any;
}): Promise<PatientModel | null> {
  try {
    if (!params._id || !params.chiefComplaint) {
      throw new Error(config.RESPONSE.ERROR.PATIENT.INVALID_PARAMETER.ADD_TO_SET);
    }

    return await patientRepository.addToSet({
      _id: params._id,
      chiefComplaint: params.chiefComplaint,
    });
  } catch (error) {
    throw error;
  }
}

async function addToSetDiagnosis(params: {
  _id: string;
  diagnosis: any;
}): Promise<PatientModel | null> {
  try {
    if (!params._id || !params.diagnosis) {
      throw new Error(config.RESPONSE.ERROR.PATIENT.INVALID_PARAMETER.ADD_TO_SET);
    }

    return await patientRepository.addToSet({
      _id: params._id,
      diagnosis: params.diagnosis,
    });
  } catch (error) {
    throw error;
  }
}
