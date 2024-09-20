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
  getVideo,
  getVideos,
  createVideo,
  updateVideo,
  removeVideo,
  searchVideo,
};

export default videoRepository;

async function getVideo(id: string, dbParams: DbParams = {}): Promise<VideoModel | null> {
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
}

async function getVideos(dbParams: DbParams = {}): Promise<VideoModel[]> {
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
}

async function createVideo(data: Partial<VideoModel>): Promise<VideoModel> {
  return await Video.create(data);
}

async function updateVideo(data: Partial<VideoModel>): Promise<VideoModel | null> {
  return await Video.findByIdAndUpdate(data._id, data, { new: true }).lean();
}

async function removeVideo(id: string): Promise<VideoModel | null> {
  return await Video.findByIdAndDelete(id).lean();
}

async function searchVideo(params: any = {}): Promise<VideoModel[]> {
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
}
