import Doctor, { DoctorModel } from "../models/doctorModel";
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

const DoctorRepository = {
  getById,
  getAllDoctors,
  create,
  update,
  remove,
  findById,
  search,
  findOne,
};

export default DoctorRepository;

async function getById(id: string, dbParams: DbParams = {}): Promise<DoctorModel | null> {
  try {
    let query = Doctor.findById(id);

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

async function getAllDoctors(dbParams: DbParams = {}): Promise<DoctorModel[]> {
  try {
    let query = Doctor.find(dbParams.query);

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

async function findById(id: string | ObjectId): Promise<DoctorModel | null> {
  try {
    return await Doctor.findById(id).lean();
  } catch (error) {
    throw error;
  }
}

async function findOne(query: any): Promise<DoctorModel | null> {
  try {
    return await Doctor.findOne(query).lean();
  } catch (error) {
    throw error;
  }
}

async function create(data: Partial<DoctorModel>): Promise<DoctorModel> {
  try {
    return await Doctor.create(data);
  } catch (error) {
    throw error;
  }
}

async function update(data: Partial<DoctorModel>): Promise<DoctorModel | null> {
  try {
    return await Doctor.findByIdAndUpdate(data._id, data, { new: true }).lean();
  } catch (error) {
    throw error;
  }
}

async function remove(id: string): Promise<DoctorModel | null> {
  try {
    return await Doctor.findByIdAndDelete(id).lean();
  } catch (error) {
    throw error;
  }
}

async function search(params: any = {}): Promise<DoctorModel[]> {
  try {
    let aggregate = Doctor.aggregate();
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
