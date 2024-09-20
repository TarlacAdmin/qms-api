import SpecialDates, { SpecialDatesModel } from "../models/specialDatesModel";

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

const specialDatesRepository = {
  getSpecialDate,
  getSpecialDates,
  createSpecialDate,
  updateSpecialDate,
  removeSpecialDate,
  searchSpecialDate,
};

export default specialDatesRepository;

async function getSpecialDate(
  id: string,
  dbParams: DbParams = {}
): Promise<SpecialDatesModel | null> {
  let query = SpecialDates.findById(id);

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

async function getSpecialDates(dbParams: DbParams = {}): Promise<SpecialDatesModel[]> {
  let query = SpecialDates.find(dbParams.query);

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

async function createSpecialDate(data: Partial<SpecialDatesModel>): Promise<SpecialDatesModel> {
  return await SpecialDates.create(data);
}

async function updateSpecialDate(
  data: Partial<SpecialDatesModel>
): Promise<SpecialDatesModel | null> {
  return await SpecialDates.findByIdAndUpdate(data._id, data, { new: true }).lean();
}

async function removeSpecialDate(id: string): Promise<SpecialDatesModel | null> {
  return await SpecialDates.findByIdAndDelete(id).lean();
}

async function searchSpecialDate(params: any = {}): Promise<SpecialDatesModel[]> {
  let query = SpecialDates.find();
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
