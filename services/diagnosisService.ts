import { config } from "../config/config";
import { DiagnosisModel } from "../models/diagnosisModel";
import diagnosisRepository from "../repository/diagnosisRepository";

const diagnosisService = {
  getDiagnosis,
  getDiagnoses,
  createDiagnosis,
  updateDiagnosis,
  removeDiagnosis,
  searchDiagnosis,
};

export default diagnosisService;

async function getDiagnosis(id: string, params: any): Promise<DiagnosisModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.DIAGNOSIS.INVALID_PARAMETER.GET);
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

    return await diagnosisRepository.getDiagnosis(id, dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function getDiagnoses(params: any): Promise<DiagnosisModel[]> {
  if (!params) {
    throw new Error(config.RESPONSE.ERROR.DIAGNOSIS.INVALID_PARAMETER.GET_ALL);
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

    return await diagnosisRepository.getDiagnoses(dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function createDiagnosis(data: Partial<DiagnosisModel>): Promise<DiagnosisModel> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.DIAGNOSIS.INVALID_PARAMETER.CREATE);
  }

  try {
    return await diagnosisRepository.createDiagnosis(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function updateDiagnosis(data: Partial<DiagnosisModel>): Promise<DiagnosisModel | null> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.DIAGNOSIS.INVALID_PARAMETER.UPDATE);
  }

  try {
    return await diagnosisRepository.updateDiagnosis(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function removeDiagnosis(id: string): Promise<DiagnosisModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.DIAGNOSIS.INVALID_PARAMETER.REMOVE);
  }

  try {
    return await diagnosisRepository.removeDiagnosis(id);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function searchDiagnosis(params: any): Promise<DiagnosisModel[] | null> {
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

    return await diagnosisRepository.searchDiagnosis(dbParams);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
