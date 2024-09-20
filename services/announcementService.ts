import { config } from "../config/config";
import { AnnouncementModel } from "../models/announcementModel";
import announcementRepository from "../repository/announcementRepository";

const announcementService = {
  getAnnouncement,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  removeAnnouncement,
  searchAnnouncement,
};

export default announcementService;

async function getAnnouncement(id: string, params: any): Promise<AnnouncementModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.ANNOUNCEMENT.INVALID_PARAMETER.GET);
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

    return await announcementRepository.getAnnouncement(id, dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function getAnnouncements(params: any): Promise<AnnouncementModel[]> {
  if (!params) {
    throw new Error(config.RESPONSE.ERROR.ANNOUNCEMENT.INVALID_PARAMETER.GET_ALL);
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

    return await announcementRepository.getAnnouncements(dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function createAnnouncement(data: Partial<AnnouncementModel>): Promise<AnnouncementModel> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.ANNOUNCEMENT.INVALID_PARAMETER.CREATE);
  }

  try {
    return await announcementRepository.createAnnouncement(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function updateAnnouncement(
  data: Partial<AnnouncementModel>
): Promise<AnnouncementModel | null> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.ANNOUNCEMENT.INVALID_PARAMETER.UPDATE);
  }

  try {
    return await announcementRepository.updateAnnouncement(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function removeAnnouncement(id: string): Promise<AnnouncementModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.ANNOUNCEMENT.INVALID_PARAMETER.REMOVE);
  }

  try {
    return await announcementRepository.removeAnnouncement(id);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function searchAnnouncement(params: any): Promise<AnnouncementModel[] | null> {
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

    return await announcementRepository.searchAnnouncement(dbParams);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
