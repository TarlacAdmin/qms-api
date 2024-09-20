// Purpose: To define the API endpoints for the application.
// Note: This file is used by the routes to define the API endpoints.
export const API_ENDPOINTS = {
  MAIN: {
    DEFAULT: "/api",
  },

  USER: {
    GET_ALL: "/user/get/all",
    GET_BY_ID: "/user/get/:id",
    CREATE: "/user/create",
    UPDATE: "/user/update",
    REMOVE: "/user/remove/:id",
    LOGIN: "/user/login",
    LOGOUT: "/user/logout",
    CHECKLOGIN: "/current/user",
    SEARCH: "/user/search",
  },

  QUEUE: {
    GET_ALL: "/queue/get/all",
    GET_BY_ID: "/queue/get/:id",
    CREATE: "/queue/create",
    UPDATE: "/queue/update",
    SEARCH: "/queue/search",
    REMOVE_BY_ID: "/queue/remove/:id",
    GET_TOTAL: "/queue/get/total",
  },

  PATIENT: {
    GET_ALL: "/patient/get/all",
    GET_BY_ID: "/patient/get/:id",
    CREATE: "/patient/create",
    UPDATE: "/patient/update",
    SEARCH: "/patient/search",
    REMOVE_BY_ID: "/patient/remove/:id",
    ADD_TO_SET_CHIEF_COMPLAINT: "/patient/chiefcomplaint",
    ADD_TO_SET_DIAGNOSIS: "/patient/diagnosis",
    ADD_TO_SET_BHW: "/patient/bhw",
  },

  DOCTOR: {
    GET_ALL: "/doctor/get/all",
    GET_BY_ID: "/doctor/get/:id",
    CREATE: "/doctor/create",
    UPDATE: "/doctor/update",
    SEARCH: "/doctor/search",
    REMOVE_BY_ID: "/doctor/remove/:id",
  },

  APPOINTMENT: {
    GET_ALL: "/appointment/get/all",
    GET_BY_ID: "/appointment/get/:id",
    GET_TOTAL: "/appointment/get/total",
    CREATE: "/appointment/create",
    UPDATE: "/appointment/update",
    SEARCH: "/appointment/search",
    SEARCH_APPOINTMENTS: "/appointment/search/appointments",
    REMOVE_BY_ID: "/appointment/remove/:id",
  },

  ANNOUNCEMENT: {
    GET_ALL: "/announcement/get/all",
    GET_BY_ID: "/announcement/get/:id",
    CREATE: "/announcement/create",
    UPDATE: "/announcement/update",
    SEARCH: "/announcement/search",
    REMOVE_BY_ID: "/announcement/remove/:id",
  },

  SPECIALDATE: {
    GET_ALL: "/specialdate/get/all",
    GET_BY_ID: "/specialdate/get/:id",
    CREATE: "/specialdate/create",
    UPDATE: "/specialdate/update",
    SEARCH: "/specialdate/search",
    REMOVE_BY_ID: "/specialdate/remove/:id",
  },

  VIDEO: {
    GET_ALL: "/video/get/all",
    GET_BY_ID: "/video/get/:id",
    CREATE: "/video/create",
    UPDATE: "/video/update",
    SEARCH: "/video/search",
    REMOVE_BY_ID: "/video/remove/:id",
  },
};
