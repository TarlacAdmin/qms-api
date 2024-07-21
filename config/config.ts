import wildCardOrigin from "../helper/checkOrigin";
import { CallbackFunction } from "../helper/types";
// Purpose: Configuration file for the project.
// Note: This is a sample configuration file. Modify this file to fit your project's needs.

// Configuration object
export const config = {
  PORT: 5000,

  MSG: {
    WELCOME: "You're successfully connected to Tarlac Solutions (API)",
  },

  SUCCESS: {
    SERVER: "Server is running on port:",
    DATABASE: "Database connected:",

    USER: {
      REGISTER: "User registered successfully",
      LOGIN: "Login successful",
      UPDATE: "Update successful",
      DELETE: "Delete successful",
      LOGOUT: "Logout successful, token cleared.",
    },
  },

  STATUS: {
    VALIDATION_ERROR: {
      CODE: 400,
      TITLE: "Validation error",
    },
    UNAUTHORIZED: {
      CODE: 401,
      TITLE: "Unauthorized",
    },
    FORBIDDEN: {
      CODE: 403,
      TITLE: "Forbidden",
    },
    NOT_FOUND: {
      CODE: 404,
      TITLE: "Not found",
    },
    SERVER_ERROR: {
      CODE: 500,
      TITLE: "Server error",
    },
    DEFAULT_ERROR: {
      TITLE: "Unexpected error",
      CODE: 500,
      UNEXPECTED: "An unexpected error occurred. Please try again later.",
    },
  },

  CORS: {
    METHODS: ["GET", "POST", "PUT", "DELETE"],
    LOCAL: "http://localhost:5173",
    DEV_BRANCH: "https://qms-app-dev.web.app",
    TEST_BRANCH: "https://qms-app-test.web.app",
    DEV_SITE: function (origin: string, callback: CallbackFunction) {
      wildCardOrigin(origin, callback, "https://qms-app-dev");
    },
    TEST_SITE: function (origin: string, callback: CallbackFunction) {
      wildCardOrigin(origin, callback, "https://qms-app-test");
    },
  },

  DB: {
    URI: "mongodb+srv://tarlacsolutionsinc:RJc83AVcrahVG4RC@tarlac-prod-clusterm2.ofhfszm.mongodb.net/prod?retryWrites=true&w=majority&appName=Tarlac-Prod-ClusterM2",
    COLLECTION: "sessions",
  },

  JWTCONFIG: {
    SECRET: "t@r!@c",
    BEARER_REGEX: /^Bearer\s+(\S+)$/,
    ADMIN_EXPIRESIN: "1d",
    EXPIRESIN: "1h",
    CLEAR_COOKIE: "jwt",
  },

  ERROR: {
    MONGODB_NOT_DEFINE: "MONGODB_URI is not defined in the environment variables.",
    CONNECTION_FAILED: "Database connection failed:",
    UNEXPECTED: "An unexpected error occurred. Please try again later.",

    USER: {
      NOT_AUTHORIZED: "User is not authorized",
      NOT_FOUND: "User not found",
      INVALID_CREDENTIALS: "Invalid credentials",
      EMAIL_ALREADY_EXISTS: "Email already exists",
      NO_ACCOUNT: "No account found with this email. Please register.",
      INVALID_EMAIL: "Invalid email format",
      REQUIRED_FIELDS: "Both email and password are required.",
      ALREADY_EXIST: "User already exists",
      UPDATE_FAILED: "An error occurred during the update.",
      INVALID_ID: "Invalid user ID",
    },
  },

  METHOD: {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
  },

  VALIDATION: {
    USER: {
      EMAIL: "email",
      PASSWORD: "password",
      ID: "id",
    },

    QUEUE: {
      ERROR: {
        REQUIRED_QUEUE: "Fill all required queue fields",
        INVALID_ID: "Invalid Queue ID",
      },

      BODY: {
        QUEUE_NUMBER: "queueNumber",
        ID: "_id",
      },

      PARAMS: {
        ID: "id",
        INVALID_ID: "Invalid queue id",
      },
    },

    PATIENT: {
      ERROR: {
        REQUIRED_PATIENT: "Fill all required patient fields",
        INVALID_ID: "Invalid Patient ID",
      },

      BODY: {
        PATIENT_FIRSTNAME: "firstname",
        PATIENT_LASTNAME: "lastname",
        PATIENT_MIDDLENAME: "middlename",
        ID: "_id",
      },

      PARAMS: {
        ID: "id",
        INVALID_ID: "Invalid patient id",
      },
    },
  },

  RESPONSE: {
    ERROR: {
      QUEUE: {
        ID: "queueId is missing!",
        NOT_FOUND: "Queue not found",
        REMOVE: "Error removing field",
        UPDATE: "Error updating field",
        ALREADY_EXISTS: "Queue already exists",
        NOT_FOUND_ID: "Queue not found! with the provided _id",
        INVALID_PARAMETER: {
          GET: "queueService.get params is missing!",
          GET_ALL: "queueService.getAllField params is missing!",
          CREATE: "queueService.create params is missing!",
          UPDATE: "queueService.update params is missing!",
          ID: "queueService.update params._id is missing!",
          REMOVE: "queueService.remove params is missing!",
          SEARCH: "queueService.search params is missing!",
        },
      },
      PATIENT: {
        ID: "patientId is missing!",
        NOT_FOUND: "Patient not found",
        REMOVE: "Error removing field",
        UPDATE: "Error updating field",
        ALREADY_EXISTS: "Patient already exists",
        NOT_FOUND_ID: "Patient not found! with the provided _id",
        INVALID_PARAMETER: {
          GET: "patientService.get params is missing!",
          GET_ALL: "patientService.getAllField params is missing!",
          CREATE: "patientService.create params is missing!",
          UPDATE: "patientService.update params is missing!",
          ID: "patientService.update params._id is missing!",
          REMOVE: "patientService.remove params is missing!",
          SEARCH: "patientService.search params is missing!",
        },
      },
    },
  },
};
