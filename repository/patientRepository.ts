import Patient, { PatientModel } from "../models/patientModel";
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

const patientRepository = {
  getPatient,
  getPatients,
  createPatient,
  updatePatient,
  removePatient,
  searchPatient,
  findOrCreate,
};

export default patientRepository;

async function getPatient(id: string, dbParams: DbParams = {}): Promise<PatientModel | null> {
  let query = Patient.findById(id);

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

async function getPatients(dbParams: DbParams = {}): Promise<PatientModel[]> {
  let query = Patient.find(dbParams.query);

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

async function createPatient(data: Partial<PatientModel>): Promise<PatientModel> {
  return await Patient.create(data);
}

async function updatePatient(data: Partial<PatientModel>): Promise<PatientModel | null> {
  return await Patient.findByIdAndUpdate(data._id, data, { new: true }).lean();
}

async function removePatient(id: string): Promise<PatientModel | null> {
  return await Patient.findByIdAndDelete(id).lean();
}

async function searchPatient(params: any = {}): Promise<PatientModel[]> {
  let aggregate = Patient.aggregate();
  if (params.search) {
    aggregate.search(params.search);
  }
  if (params.match) {
    aggregate.match(params.match);
  }
  aggregate.project(params.project);
  aggregate.sort(params.sort);
  aggregate.limit(params.limit);
  return await aggregate.exec();
}

async function findOrCreate(query: any): Promise<PatientModel | null> {
  return await Patient.findOne(query).lean();
}