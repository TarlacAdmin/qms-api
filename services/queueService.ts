import queueRepository from "../repository/queueRepository";
import userRepository from "../repository/userRepository";
import { IQueue } from "../models/queueModel";
import { config } from "../config/config";

const queueService = {
  getById,
  getAllQueues,
  create,
  update,
  remove,
  search,
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
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const latestQueue = await queueRepository.search({
      counter: data.counter,
      createdAt: { $gte: today }
    });

    let queueNumber;
    if (latestQueue && latestQueue.length > 0) {
      const latestNumber = parseInt(latestQueue[0].queueNumber, 10);
      queueNumber = String(latestNumber + 1).padStart(3, '0');
    } else {
      queueNumber = '001';
    }

    data.queueNumber = queueNumber;
    //TODO
    // data.metadata.patient = await userRepository.findOrCreate(data.metadata?.patient)
    return await queueRepository.create(data);

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function update(data: Partial<IQueue>): Promise<IQueue | null> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.QUEUE.INVALID_PARAMETER.UPDATE);
  }

  try {
    return await queueRepository.update(data);
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

async function search(params: any): Promise<IQueue[] | null> {
  //TODO: VAlidation

  try {
    return await queueRepository.search(params);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}
