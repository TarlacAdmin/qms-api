import { config } from "../config/config";
import { QueueModel } from "../models/queueModel";
import { ObjectId } from "mongodb";
import queueRepository from "../repository/queueRepository";
import patientService from "./patientService";

const queueService = {
  getQueue,
  getQueues,
  createQueue,
  updateQueue,
  removeQueue,
  searchQueue,
};

export default queueService;

async function getQueue(id: string, params: any): Promise<QueueModel | null> {
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

    return await queueRepository.getQueue(id, dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function getQueues(params: any): Promise<QueueModel[]> {
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
      dbParams.options.populateArray = Array.isArray(params.populateArray)
        ? params.populateArray
        : [params.populateArray];
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

    return await queueRepository.getQueues(dbParams);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function createQueue(data: Partial<QueueModel>): Promise<QueueModel> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.QUEUE.INVALID_PARAMETER.CREATE);
  }

  try {
    if (data.counter === "interview") {
      data.queueNumber = await generateQueueNumber(data.counter);
    }

    if (data.metadata?.patient) {
      const patient = await patientService.findOrCreate(data.metadata.patient);
      data.metadata.patient = patient._id as ObjectId;
    }

    let createdQueue = await queueRepository.createQueue(data);
    createdQueue = await createdQueue.populate("metadata.patient");

    return createdQueue;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function updateQueue(data: Partial<QueueModel>): Promise<QueueModel | null> {
  if (!data) {
    throw new Error(config.RESPONSE.ERROR.QUEUE.INVALID_PARAMETER.UPDATE);
  }

  try {
    return await queueRepository.updateQueue(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function removeQueue(id: string): Promise<QueueModel | null> {
  if (!id) {
    throw new Error(config.RESPONSE.ERROR.QUEUE.INVALID_PARAMETER.REMOVE);
  }

  try {
    return await queueRepository.removeQueue(id);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

async function searchQueue(params: any): Promise<QueueModel[] | null> {
  //TODO: VAlidation

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

    return await queueRepository.searchQueue(dbParams);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function generateQueueNumber(counterName: string): Promise<string> {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const queues = await searchQueue({
    query: {
      counter: counterName,
      createdAt: { $gte: today },
    },
    sort: "-createdAt",
    limit: 999,
    select: "queueNumber",
  });

  let queueNumber;
  //TODO: Check if counter = interview. Generate new number. ELSE, use existing "data.queueNumber"
  if (queues && queues.length > 0) {
    const latestNumber = parseInt(queues[0].queueNumber, 10);
    return (queueNumber = String(latestNumber + 1).padStart(3, "0"));
  } else {
    return (queueNumber = "001");
  }
}
