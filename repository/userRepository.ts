import User, { IUser } from "../models/userModel";

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

const userRepository = {
  getUser,
  getUsers,
  findByEmail,
  createUser,
  updateUser,
  deleteUser,
  search,
  findOrCreate,
};

export default userRepository;

async function getUser(id: string, dbParams: DbParams = {}): Promise<IUser | null> {
  try {
    let query = User.findById(id);

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

async function getUsers(dbParams: DbParams): Promise<IUser[]> {
  try {
    let query = User.find(dbParams.query);

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

async function findByEmail(email: string): Promise<IUser | null> {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw error;
  }
}

async function createUser(data: Partial<IUser>): Promise<IUser | null> {
  try {
    let user = await User.create(data);
    const userWithoutPassword = await User.findById(user.id).select("-password").lean();
    return userWithoutPassword as IUser | null;
  } catch (error) {
    throw error;
  }
}

async function updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
  try {
    return await User.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    throw error;
  }
}

async function deleteUser(id: string): Promise<IUser | null> {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
}

async function search(query: string): Promise<IUser[]> {
  try {
    return User.find(
      {
        $text: { $search: query },
      },
      {
        score: { $meta: "textScore" },
      }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(20);
  } catch (error) {
    throw error;
  }
}

async function findOrCreate(params: any) {
  //TODO: Add one more checker
  // let user = await User.findOne({
  //   firstName: params.firstName,
  //   lastName: params.lastName,
  //   middleName: params.middleName,
  // });
  // if (!user) {
  //   const newUser = await User.create(params);
  //   return newUser._id;
  // }
  // return user._id;
}
