import Queue, { QueueModel } from "../models/queueModel";

interface DbParams {
  query?: any;
  options?: {
    populateArray?: any[];
    select?: string;
    lean?: boolean;
    sort?: any;
    limit?: number;
  };
}

const queueRepository = {
  getQueue,
  getQueues,
  createQueue,
  updateQueue,
  removeQueue,
  searchQueue,
};

export default queueRepository;

async function getQueue(id: string, dbParams: DbParams = {}): Promise<QueueModel | null> {
  let query = Queue.findById(id);

  (dbParams.options?.populateArray || []).forEach((populateOption) => {
    query = query.populate(populateOption);
  });

  const options = {
    select: dbParams.options?.select || "_id",
    lean: dbParams.options?.lean || true,
  };

  query = query.select(options.select).lean(options.lean);

  return query.exec();
}

async function getQueues(dbParams: DbParams = {}): Promise<QueueModel[]> {
  let query = Queue.find(dbParams.query);

  (dbParams.options?.populateArray || []).forEach((populateOption) => {
    query = query.populate(populateOption);
  });

  const options = {
    sort: dbParams.options?.sort || {},
    limit: dbParams.options?.limit || 10,
    select: dbParams.options?.select || "_id",
    lean: dbParams.options?.lean || true,
  };

  query = query.sort(options.sort).limit(options.limit).select(options.select).lean(options.lean);

  return query.exec();
}

async function createQueue(data: Partial<QueueModel>): Promise<QueueModel> {
  return await Queue.create(data);
}

async function updateQueue(data: Partial<QueueModel>): Promise<QueueModel | null> {
  return await Queue.findByIdAndUpdate(data._id, data, { new: true }).lean();
}

async function removeQueue(id: string): Promise<QueueModel | null> {
  return await Queue.findByIdAndDelete(id);
}

async function searchQueue(params: any = {}): Promise<QueueModel[]> {
  let query = Queue.find();
  query.setQuery(params.query);
  query.populate(params.populateArray);
  query.projection(params.projection);
  query.setOptions(params.options);
  query.lean(params.lean);
  return query.exec();
}
