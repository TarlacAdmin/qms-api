import { Model, Query } from "mongoose";
import { SearchParams } from "../types/searchTypes";

// Build a search query based on the model and search parameters
export function buildSearchQuery(model: Model<any>, params: SearchParams): Query<any, any> {
  let query = model.find();

  if (params.textQuery) {
    if (model.modelName === "Patient") {
      query = query.find({
        $or: [
          { firstName: { $regex: params.textQuery, $options: "i" } },
          { lastName: { $regex: params.textQuery, $options: "i" } },
        ],
      });
    } else if (model.modelName === "Doctor") {
      query = query.find({
        $or: [
          { firstname: { $regex: params.textQuery, $options: "i" } },
          { lastname: { $regex: params.textQuery, $options: "i" } },
        ],
      });
    } else {
      query = query.find({ $text: { $search: params.textQuery } });
    }
  }

  if (params.startDate || params.endDate) {
    const dateMatch: { $gte?: Date; $lte?: Date } = {};
    if (params.startDate) dateMatch.$gte = new Date(params.startDate);
    if (params.endDate) dateMatch.$lte = new Date(params.endDate);
    query = query.where({ date: dateMatch });
  }

  if (params.match) {
    query = query.where(params.match);
  }

  if (params.populateArray && model.modelName === "Appointment") {
    params.populateArray.forEach((populateOption) => {
      query = query.populate(populateOption);
    });
  }

  if (params.projection) {
    query = query.select(params.projection);
  }

  if (params.options) {
    query = query.setOptions(params.options);
  }

  if (params.sort) {
    query = query.sort(params.sort);
  }

  if (params.limit) {
    query = query.limit(params.limit);
  }

  query = query.lean(params.lean !== false);

  return query;
}

export function formatResults(
  results: Array<{ type: string; results: any[] }>,
  searchType?: string
): any {
  if (searchType === "all" || !searchType) {
    return results.reduce((acc, { type, results }) => {
      acc[`${type}s`] = results.map((item) => ({ ...item, type }));
      return acc;
    }, {} as Record<string, any[]>);
  }

  const [singleTypeResult] = results;
  return singleTypeResult.results.map((item) => ({ ...item, type: singleTypeResult.type }));
}
