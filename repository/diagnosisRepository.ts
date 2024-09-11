import Diagnosis, { DiagnosisModel } from "../models/diagnosisModel";

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

const diagnosisRepository = {
  getById,
  getAllDiagnosis,
  create,
  update,
  remove,
  search,
};

export default diagnosisRepository;

async function getById(id: string, dbParams: DbParams = {}): Promise<DiagnosisModel | null> {
  try {
    let query = Diagnosis.findById(id);

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

async function getAllDiagnosis(dbParams: DbParams = {}): Promise<DiagnosisModel[]> {
  try {
    let query = Diagnosis.find(dbParams.query);

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

async function create(data: Partial<DiagnosisModel>): Promise<DiagnosisModel> {
  try {
    return await Diagnosis.create(data);
  } catch (error) {
    throw error;
  }
}

async function update(data: Partial<DiagnosisModel>): Promise<DiagnosisModel | null> {
  try {
    return await Diagnosis.findByIdAndUpdate(data._id, data, { new: true }).lean();
  } catch (error) {
    throw error;
  }
}

async function remove(id: string): Promise<DiagnosisModel | null> {
  try {
    return await Diagnosis.findByIdAndDelete(id).lean();
  } catch (error) {
    throw error;
  }
}

async function search(params: any = {}): Promise<DiagnosisModel[]> {
  try {
    let query = Diagnosis.find();
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
