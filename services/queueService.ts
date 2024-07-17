import queueRepository from "../repository/queueRepository";
import { IQueue } from "../models/queueModel";
import { config } from "../config/config";

const queueService = {
  getById,
  getAllQueues,
  create,
  update,
  remove,
};

export default queueService;

async function getById(id: string, params: any): Promise<IQueue | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.QUEUE.INVALID_PARAMETER.GET);
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

    return await queueRepository.getById(id, dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function getAllQueues(params: any): Promise<IQueue[]> {
  if (!params) {
    throw new Error(config.RESPONSE.ERROR.QUEUE.INVALID_PARAMETER.GET_ALL);
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

    return await queueRepository.getAllQueues(dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function create(data: Partial<IQueue>): Promise<IQueue> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.QUEUE.INVALID_PARAMETER.CREATE);
  }

  try {
    return await queueRepository.create(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function update(id: string, data: Partial<IQueue>): Promise<IQueue | null> {
  if (!id || !data) {
    throw new Error(config.RESPONSE.ERROR.QUEUE.INVALID_PARAMETER.UPDATE);
  }

  try {
    return await queueRepository.update(id, data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function remove(id: string): Promise<IQueue | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.QUEUE.INVALID_PARAMETER.REMOVE);
  }

  try {
    return await queueRepository.remove(id);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
