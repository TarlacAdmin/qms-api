import { config } from "../config/config";
import { VideoModel } from "../models/videoModel";
import videoRepository from "../repository/videoRepository";

const videoService = {
  getVideo,
  getVideos,
  createVideo,
  updateVideo,
  removeVideo,
  searchVideo,
};

export default videoService;

async function getVideo(id: string, params: any): Promise<VideoModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.VIDEO.INVALID_PARAMETER.GET);
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

    return await videoRepository.getVideo(id, dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function getVideos(params: any): Promise<VideoModel[]> {
  if (!params) {
    throw new Error(config.RESPONSE.ERROR.VIDEO.INVALID_PARAMETER.GET_ALL);
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

    return await videoRepository.getVideos(dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function createVideo(data: Partial<VideoModel>): Promise<VideoModel> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.VIDEO.INVALID_PARAMETER.CREATE);
  }

  try {
    return await videoRepository.createVideo(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function updateVideo(data: Partial<VideoModel>): Promise<VideoModel | null> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.VIDEO.INVALID_PARAMETER.UPDATE);
  }

  try {
    return await videoRepository.updateVideo(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function removeVideo(id: string): Promise<VideoModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.VIDEO.INVALID_PARAMETER.REMOVE);
  }

  try {
    return await videoRepository.removeVideo(id);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function searchVideo(params: any): Promise<VideoModel[] | null> {
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

    return await videoRepository.searchVideo(dbParams);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
