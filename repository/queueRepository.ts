import Queue, { QueueModel } from "../models/queueModel";
import { ObjectId } from "mongodb";

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
  search,
  pushPatientToMetadata,
  getTotalQueuesNumber,
};

export default queueRepository;

async function getById(id: string, dbParams: DbParams = {}): Promise<QueueModel | null> {
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

async function getAllQueues(dbParams: DbParams = {}): Promise<QueueModel[]> {
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

async function create(data: Partial<QueueModel>): Promise<QueueModel> {
  try {
    return await Queue.create(data);
  } catch (error) {
    throw error;
  }
}

async function pushPatientToMetadata(
  queueId: string,
  patientId: string
): Promise<QueueModel | null> {
  try {
    return await Queue.findByIdAndUpdate(
      queueId,
      { $set: { "metadata.patient": patientId } },
      { new: true }
    ).lean();
  } catch (error) {
    throw error;
  }
}

async function update(data: Partial<QueueModel>): Promise<QueueModel | null> {
  try {
    return await Queue.findByIdAndUpdate(data._id, data, { new: true })
      // .select("-metadata.patient.emr")
      .lean();
  } catch (error) {
    throw error;
  }
}

async function findById(id: string): Promise<QueueModel | null> {
  try {
    return await Queue.findById(id).lean();
  } catch (error) {
    throw error;
  }
}

async function remove(id: string): Promise<QueueModel | null> {
  try {
    return await Queue.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
}

async function search(params: any = {}): Promise<QueueModel[]> {
  try {
    // return await Queue.find(params).sort({ createdAt: -1 }).exec();;
    let query = Queue.find();
    query.setQuery(params.query);
    query.populate(params.populateArray);
    query.projection(params.projection);
    query.setOptions(params.options);
    query.lean(params.lean);
    return query.exec();
  } catch (error) {
    throw error;
  }
}

// nagprapractice lang po ako ng mga aggregation queries, dedelete ko rin po ito HAHAHAHHA
async function getTotalQueuesNumber(): Promise<number[]> {
  try {
    const total = await Queue.aggregate([
      {
        $match: {
          queueNumber: {
            $eq: "001",
          },
        },
      },
      {
        $count: "total queues",
      },
    ]);

    console.log(total);

    return total;
  } catch (error) {
    throw error;
  }
}
