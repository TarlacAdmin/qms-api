import Video, { VideoModel } from "../models/videoModel";

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

const videoRepository = {
  getById,
  getAllVideo,
  create,
  update,
  remove,
  search,
};

export default videoRepository;

async function getById(id: string, dbParams: DbParams = {}): Promise<VideoModel | null> {
  try {
    let query = Video.findById(id);

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

async function getAllVideo(dbParams: DbParams = {}): Promise<VideoModel[]> {
  try {
    let query = Video.find(dbParams.query);

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

async function create(data: Partial<VideoModel>): Promise<VideoModel> {
  try {
    return await Video.create(data);
  } catch (error) {
    throw error;
  }
}

async function update(data: Partial<VideoModel>): Promise<VideoModel | null> {
  try {
    return await Video.findByIdAndUpdate(data._id, data, { new: true }).lean();
  } catch (error) {
    throw error;
  }
}

async function remove(id: string): Promise<VideoModel | null> {
  try {
    return await Video.findByIdAndDelete(id).lean();
  } catch (error) {
    throw error;
  }
}

async function search(params: any = {}): Promise<VideoModel[]> {
  try {
    let query = Video.find();
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
