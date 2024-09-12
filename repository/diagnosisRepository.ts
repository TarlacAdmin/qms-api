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
  getDiagnosis,
  getDiagnoses,
  createDiagnosis,
  updateDiagnosis,
  removeDiagnosis,
  searchDiagnosis,
};

export default diagnosisRepository;

async function getDiagnosis(id: string, dbParams: DbParams = {}): Promise<DiagnosisModel | null> {
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
}

async function getDiagnoses(dbParams: DbParams = {}): Promise<DiagnosisModel[]> {
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
}

async function createDiagnosis(data: Partial<DiagnosisModel>): Promise<DiagnosisModel> {
  return await Diagnosis.create(data);
}

async function updateDiagnosis(data: Partial<DiagnosisModel>): Promise<DiagnosisModel | null> {
  return await Diagnosis.findByIdAndUpdate(data._id, data, { new: true }).lean();
}

async function removeDiagnosis(id: string): Promise<DiagnosisModel | null> {
  return await Diagnosis.findByIdAndDelete(id).lean();
}

async function searchDiagnosis(params: any = {}): Promise<DiagnosisModel[]> {
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
}
