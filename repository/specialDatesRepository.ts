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
  getById,
  getAllSpecialDates,
  create,
  update,
  remove,
  search,
};

export default specialDatesRepository;

async function getById(id: string, dbParams: DbParams = {}): Promise<SpecialDatesModel | null> {
  try {
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
  } catch (error) {
    throw error;
  }
}

async function getAllSpecialDates(dbParams: DbParams = {}): Promise<SpecialDatesModel[]> {
  try {
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
  } catch (error) {
    throw error;
  }
}

async function create(data: Partial<SpecialDatesModel>): Promise<SpecialDatesModel> {
  try {
    return await SpecialDates.create(data);
  } catch (error) {
    throw error;
  }
}

async function update(data: Partial<SpecialDatesModel>): Promise<SpecialDatesModel | null> {
  try {
    return await SpecialDates.findByIdAndUpdate(data._id, data, { new: true }).lean();
  } catch (error) {
    throw error;
  }
}

async function remove(id: string): Promise<SpecialDatesModel | null> {
  try {
    return await SpecialDates.findByIdAndDelete(id).lean();
  } catch (error) {
    throw error;
  }
}

async function search(params: any = {}): Promise<SpecialDatesModel[]> {
  try {
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
  } catch (error) {
    throw error;
  }
}
