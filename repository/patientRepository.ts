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
  getById,
  getAllPatients,
  create,
  update,
  remove,
  findById,
  search,
  findOne,
  findOrCreate,
};

export default patientRepository;

async function getById(id: string, dbParams: DbParams = {}): Promise<PatientModel | null> {
  try {
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
  } catch (error) {
    throw error;
  }
}

async function getAllPatients(dbParams: DbParams = {}): Promise<PatientModel[]> {
  try {
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
  } catch (error) {
    throw error;
  }
}

async function create(data: Partial<PatientModel>): Promise<PatientModel> {
  try {
    return await Patient.create(data);
  } catch (error) {
    throw error;
  }
}

async function findOrCreate(data: Partial<PatientModel> | ObjectId): Promise<PatientModel> {
  try {
    let patient;
    if (data instanceof ObjectId) {
      patient = await Patient.findById(data).lean<PatientModel>();
    } else {
      patient = await Patient.findOne({ _id: data._id }).lean<PatientModel>();
    }
    if (!patient) {
      patient = (await Patient.create(data)).toObject();
    }
    return patient;
  } catch (error) {
    throw error;
  }
}

async function findOne(query: any): Promise<PatientModel | null> {
  try {
    return await Patient.findOne(query).lean();
  } catch (error) {
    throw error;
  }
}

async function update(data: Partial<PatientModel>): Promise<PatientModel | null> {
  try {
    return await Patient.findByIdAndUpdate(data._id, data, { new: true }).lean();
  } catch (error) {
    throw error;
  }
}

async function findById(id: string | ObjectId): Promise<PatientModel | null> {
  try {
    return await Patient.findById(id).lean();
  } catch (error) {
    throw error;
  }
}

async function remove(id: string): Promise<PatientModel | null> {
  try {
    return await Patient.findByIdAndDelete(id).lean();
  } catch (error) {
    throw error;
  }
}

async function search(params: any = {}): Promise<PatientModel[]> {
  try {
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
  } catch (error) {
    throw error;
  }
}
