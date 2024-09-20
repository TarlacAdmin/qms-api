import { config } from "../config/config";
import { SpecialDatesModel } from "../models/specialDatesModel";
import specialDatesRepository from "../repository/specialDatesRepository";

const specialDatesService = {
  getSpecialDate,
  getSpecialDates,
  createSpecialDate,
  updateSpecialDate,
  removeSpecialDate,
  searchSpecialDate,
};

export default specialDatesService;

async function getSpecialDate(id: string, params: any): Promise<SpecialDatesModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.SPECIALDATE.INVALID_PARAMETER.GET);
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

    return await specialDatesRepository.getSpecialDate(id, dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function getSpecialDates(params: any): Promise<SpecialDatesModel[]> {
  if (!params) {
    throw new Error(config.RESPONSE.ERROR.SPECIALDATE.INVALID_PARAMETER.GET_ALL);
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

    return await specialDatesRepository.getSpecialDates(dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function createSpecialDate(data: Partial<SpecialDatesModel>): Promise<SpecialDatesModel> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.SPECIALDATE.INVALID_PARAMETER.CREATE);
  }

  try {
    return await specialDatesRepository.createSpecialDate(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function updateSpecialDate(
  data: Partial<SpecialDatesModel>
): Promise<SpecialDatesModel | null> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.SPECIALDATE.INVALID_PARAMETER.UPDATE);
  }

  try {
    return await specialDatesRepository.updateSpecialDate(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function removeSpecialDate(id: string): Promise<SpecialDatesModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.SPECIALDATE.INVALID_PARAMETER.REMOVE);
  }

  try {
    return await specialDatesRepository.removeSpecialDate(id);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function searchSpecialDate(params: any): Promise<SpecialDatesModel[] | null> {
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

    return await specialDatesRepository.searchSpecialDate(dbParams);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
