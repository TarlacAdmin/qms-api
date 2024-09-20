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
  getAnnouncement,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  removeAnnouncement,
  searchAnnouncement,
};

export default announcementRepository;

async function getAnnouncement(
  id: string,
  dbParams: DbParams = {}
): Promise<AnnouncementModel | null> {
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
}

async function getAnnouncements(dbParams: DbParams = {}): Promise<AnnouncementModel[]> {
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
}

async function createAnnouncement(data: Partial<AnnouncementModel>): Promise<AnnouncementModel> {
  return await Announcement.create(data);
}

async function updateAnnouncement(
  data: Partial<AnnouncementModel>
): Promise<AnnouncementModel | null> {
  return await Announcement.findByIdAndUpdate(data._id, data, { new: true }).lean();
}

async function removeAnnouncement(id: string): Promise<AnnouncementModel | null> {
  return await Announcement.findByIdAndDelete(id).lean();
}

async function searchAnnouncement(params: any = {}): Promise<AnnouncementModel[]> {
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
}
