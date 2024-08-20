import { SearchParams } from "../types/searchTypes";

// Purpose: Build a search stage for the aggregation pipeline
export function buildBaseSearchStage(textQuery: string | undefined): any[] {
  if (!textQuery) return [];
  return [
    {
      $search: {
        text: {
          query: textQuery,
          path: { wildcard: "*" },
          fuzzy: {},
        },
      },
    },
  ];
}

// Purpose: Build a pipeline for searching patients
export function buildPatientPipeline(params: SearchParams): any[] {
  return [
    ...buildBaseSearchStage(params.textQuery),
    { $project: { _id: 1, firstName: 1, lastName: 1, birthdate: 1, sex: 1, cellphoneNumber: 1 } },
    { $sort: params.sort || { lastName: 1, firstName: 1 } },
    { $limit: params.limit || 100 },
  ];
}

// Purpose: Build a pipeline for searching doctors
export function buildDoctorPipeline(params: SearchParams): any[] {
  return [
    ...buildBaseSearchStage(params.textQuery),
    { $project: { _id: 1, firstname: 1, lastname: 1, degree: 1, "metadata.schedule": 1 } },
    { $sort: params.sort || { lastname: 1, firstname: 1 } },
    { $limit: params.limit || 100 },
  ];
}

// Purpose: Build a pipeline for searching appointments
export function buildAppointmentPipeline(params: SearchParams): any[] {
  const pipeline: any[] = [...buildBaseSearchStage(params.textQuery)];

  if (params.startDate || params.endDate) {
    const dateMatch: { $gte?: Date; $lte?: Date } = {};
    if (params.startDate) dateMatch.$gte = new Date(params.startDate);
    if (params.endDate) dateMatch.$lte = new Date(params.endDate);
    pipeline.push({ $match: { date: dateMatch } });
  }

  pipeline.push(
    {
      $lookup: {
        from: "patients",
        localField: "patient",
        foreignField: "_id",
        as: "patientDetails",
      },
    },
    { $unwind: "$patientDetails" },
    {
      $lookup: { from: "doctors", localField: "doctor", foreignField: "_id", as: "doctorDetails" },
    },
    { $unwind: "$doctorDetails" },
    {
      $project: {
        _id: 1,
        date: 1,
        chiefComplaint: 1,
        "patient._id": "$patientDetails._id",
        "patient.firstName": "$patientDetails.firstName",
        "patient.lastName": "$patientDetails.lastName",
        "doctor._id": "$doctorDetails._id",
        "doctor.firstname": "$doctorDetails.firstname",
        "doctor.lastname": "$doctorDetails.lastname",
      },
    },
    { $sort: params.sort || { date: -1 } },
    { $limit: params.limit || 100 }
  );

  return pipeline;
}

// Purpose: Format search results
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
