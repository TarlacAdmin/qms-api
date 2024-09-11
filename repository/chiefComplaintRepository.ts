import ChiefComplaint, { ChiefComplaintModel } from "../models/chiefComplaintModel";

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

const chiefComplaintRepository = {
  getById,
  getAllChiefComplaint,
  create,
  update,
  remove,
  search,
};

export default chiefComplaintRepository;

async function getById(id: string, dbParams: DbParams = {}): Promise<ChiefComplaintModel | null> {
  try {
    let query = ChiefComplaint.findById(id);

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

async function getAllChiefComplaint(dbParams: DbParams = {}): Promise<ChiefComplaintModel[]> {
  try {
    let query = ChiefComplaint.find(dbParams.query);

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

async function create(data: Partial<ChiefComplaintModel>): Promise<ChiefComplaintModel> {
  try {
    return await ChiefComplaint.create(data);
  } catch (error) {
    throw error;
  }
}

async function update(data: Partial<ChiefComplaintModel>): Promise<ChiefComplaintModel | null> {
  try {
    return await ChiefComplaint.findByIdAndUpdate(data._id, data, { new: true }).lean();
  } catch (error) {
    throw error;
  }
}

async function remove(id: string): Promise<ChiefComplaintModel | null> {
  try {
    return await ChiefComplaint.findByIdAndDelete(id).lean();
  } catch (error) {
    throw error;
  }
}

async function search(params: any = {}): Promise<ChiefComplaintModel[]> {
  try {
    let query = ChiefComplaint.find();
    query.setQuery(params.query);
    query.populate(params.populateArray);
    query.projection(params.projection);
    query.setOptions(params.options);
    query.lean(params.lean);

    if (params.match) {
      query.where(params.match);
    }
    return query.exec();
  } catch (error) {
    throw error;
  }
}
