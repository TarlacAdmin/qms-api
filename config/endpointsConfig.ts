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
  },
};
