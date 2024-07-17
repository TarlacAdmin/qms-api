import Queue, { IQueue } from "../models/queueModel";

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
  getById,
  getAllQueues,
  create,
  update,
  remove,
  findById,
};

export default queueRepository;

async function getById(id: string, dbParams: DbParams = {}): Promise<IQueue | null> {
  try {
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
  } catch (error) {
    throw error;
  }
}

async function getAllQueues(dbParams: DbParams = {}): Promise<IQueue[]> {
  try {
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
  } catch (error) {
    throw error;
  }
}

async function create(data: Partial<IQueue>): Promise<IQueue> {
  try {
    return await Queue.create(data);
  } catch (error) {
    throw error;
  }
}

async function update(id: string, data: Partial<IQueue>): Promise<IQueue | null> {
  try {
    return await Queue.findByIdAndUpdate(id, data, { new: true })
      .select("-metadata.patient.emr")
      .lean();
  } catch (error) {
    throw error;
  }
}

async function findById(id: string): Promise<IQueue | null> {
  try {
    return await Queue.findById(id).lean();
  } catch (error) {
    throw error;
  }
}

async function remove(id: string): Promise<IQueue | null> {
  try {
    return await Queue.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
}
