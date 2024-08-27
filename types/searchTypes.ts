export interface SearchParams {
  searchType?: "patient" | "doctor" | "appointment" | "all";
  textQuery?: string;
  startDate?: string;
  endDate?: string;
  query?: Record<string, any>;
  match?: Record<string, any>;
  populateArray?: any[];
  projection?: Record<string, any>;
  options?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  limit?: number;
  lean?: boolean;
}
