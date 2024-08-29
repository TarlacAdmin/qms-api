import Announcement, { AnnouncementModel } from "../models/announcementModel";

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

const announcementRepository = {
  getById,
  getAllAnnouncement,
  create,
  update,
  remove,
  search,
};

export default announcementRepository;

async function getById(id: string, dbParams: DbParams = {}): Promise<AnnouncementModel | null> {
  try {
    let query = Announcement.findById(id);

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

async function getAllAnnouncement(dbParams: DbParams = {}): Promise<AnnouncementModel[]> {
  try {
    let query = Announcement.find(dbParams.query);

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

async function create(data: Partial<AnnouncementModel>): Promise<AnnouncementModel> {
  try {
    return await Announcement.create(data);
  } catch (error) {
    throw error;
  }
}

async function update(data: Partial<AnnouncementModel>): Promise<AnnouncementModel | null> {
  try {
    return await Announcement.findByIdAndUpdate(data._id, data, { new: true }).lean();
  } catch (error) {
    throw error;
  }
}

async function remove(id: string): Promise<AnnouncementModel | null> {
  try {
    return await Announcement.findByIdAndDelete(id).lean();
  } catch (error) {
    throw error;
  }
}

async function search(params: any = {}): Promise<AnnouncementModel[]> {
  try {
    let query = Announcement.find();
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
