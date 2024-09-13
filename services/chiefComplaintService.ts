import { config } from "../config/config";
import { ChiefComplaintModel } from "../models/chiefComplaintModel";
import chiefComplaintRepository from "../repository/chiefComplaintRepository";

const chiefComplaintService = {
  getChiefComplaint,
  getChiefComplaints,
  createChiefComplaint,
  updateChiefComplaint,
  removeChiefComplaint,
  searchChiefComplaint,
};

export default chiefComplaintService;

async function getChiefComplaint(id: string, params: any): Promise<ChiefComplaintModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.CHIEFCOMPLAINT.INVALID_PARAMETER.GET);
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

    return await chiefComplaintRepository.getChiefComplaint(id, dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function getChiefComplaints(params: any): Promise<ChiefComplaintModel[]> {
  if (!params) {
    throw new Error(config.RESPONSE.ERROR.CHIEFCOMPLAINT.INVALID_PARAMETER.GET_ALL);
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

    return await chiefComplaintRepository.getChiefComplaints(dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function createChiefComplaint(
  data: Partial<ChiefComplaintModel>
): Promise<ChiefComplaintModel> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.CHIEFCOMPLAINT.INVALID_PARAMETER.CREATE);
  }

  try {
    return await chiefComplaintRepository.createChiefComplaint(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function updateChiefComplaint(
  data: Partial<ChiefComplaintModel>
): Promise<ChiefComplaintModel | null> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.CHIEFCOMPLAINT.INVALID_PARAMETER.UPDATE);
  }

  try {
    return await chiefComplaintRepository.updateChiefComplaint(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function removeChiefComplaint(id: string): Promise<ChiefComplaintModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.CHIEFCOMPLAINT.INVALID_PARAMETER.REMOVE);
  }

  try {
    return await chiefComplaintRepository.removeChiefComplaint(id);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function searchChiefComplaint(params: any): Promise<ChiefComplaintModel[] | null> {
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

    return await chiefComplaintRepository.searchChiefComplaint(dbParams);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
