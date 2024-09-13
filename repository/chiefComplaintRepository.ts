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
  getChiefComplaint,
  getChiefComplaints,
  createChiefComplaint,
  updateChiefComplaint,
  removeChiefComplaint,
  searchChiefComplaint,
};

export default chiefComplaintRepository;

async function getChiefComplaint(
  id: string,
  dbParams: DbParams = {}
): Promise<ChiefComplaintModel | null> {
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
}

async function getChiefComplaints(dbParams: DbParams = {}): Promise<ChiefComplaintModel[]> {
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
}

async function createChiefComplaint(
  data: Partial<ChiefComplaintModel>
): Promise<ChiefComplaintModel> {
  return await ChiefComplaint.create(data);
}

async function updateChiefComplaint(
  data: Partial<ChiefComplaintModel>
): Promise<ChiefComplaintModel | null> {
  return await ChiefComplaint.findByIdAndUpdate(data._id, data, { new: true }).lean();
}

async function removeChiefComplaint(id: string): Promise<ChiefComplaintModel | null> {
  return await ChiefComplaint.findByIdAndDelete(id).lean();
}

async function searchChiefComplaint(params: any = {}): Promise<ChiefComplaintModel[]> {
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
}
