import Doctor, { DoctorModel } from "../models/doctorModel";

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

const doctorRepository = {
  getDoctor,
  getDoctors,
  createDoctor,
  updateDoctor,
  removeDoctor,
  searchDoctor,
};

export default doctorRepository;

async function getDoctor(id: string, dbParams: DbParams = {}): Promise<DoctorModel | null> {
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
}

async function getDoctors(dbParams: DbParams = {}): Promise<DoctorModel[]> {
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
}

async function createDoctor(data: Partial<DoctorModel>): Promise<DoctorModel> {
  return await Doctor.create(data);
}

async function updateDoctor(data: Partial<DoctorModel>): Promise<DoctorModel | null> {
  return await Doctor.findByIdAndUpdate(data._id, data, { new: true }).lean();
}

async function removeDoctor(id: string): Promise<DoctorModel | null> {
  return await Doctor.findByIdAndDelete(id).lean();
}

async function searchDoctor(params: any = {}): Promise<DoctorModel[]> {
  let query = Doctor.find();
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
