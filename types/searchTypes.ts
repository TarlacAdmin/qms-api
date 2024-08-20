export interface SearchParams {
  textQuery?: string;
  startDate?: string;
  endDate?: string;
  searchType?: "patient" | "doctor" | "appointment" | "all";
  sort?: Record<string, 1 | -1>;
  limit?: number;
}
