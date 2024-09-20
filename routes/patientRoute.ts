import express, { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import patientService from "../services/patientService";
import { API_ENDPOINTS } from "../config/endpointsConfig";
import { config } from "../config/config";

const router = express.Router();

router.get(API_ENDPOINTS.PATIENT.GET_ALL, getPatients);
router.get(API_ENDPOINTS.PATIENT.GET_BY_ID, getPatient);
router.post(API_ENDPOINTS.PATIENT.CREATE, createPatient);
router.put(API_ENDPOINTS.PATIENT.UPDATE, updatePatient);
router.delete(API_ENDPOINTS.PATIENT.REMOVE_BY_ID, removePatient);
router.post(API_ENDPOINTS.PATIENT.SEARCH, searchPatient);
router.put(API_ENDPOINTS.PATIENT.ADD_TO_SET_CHIEF_COMPLAINT, addToSetChiefComplaint);
router.put(API_ENDPOINTS.PATIENT.ADD_TO_SET_DIAGNOSIS, addToSetDiagnosis);
router.put(API_ENDPOINTS.PATIENT.ADD_TO_SET_BHW, addToSetBhw);

export default router;

/*
 * @desc   get all patient
 * @route  GET /api/patient/get/all
 * @access Private
 */
async function getPatients(req: Request, res: Response) {
  const params = {
    query: req.query.query || {},
    queryArray: req.query.queryArray,
    queryArrayType: req.query.queryArrayType,
    populateArray: req.query.populateArray || [],
    sort: req.query.sort,
    limit: req.query.limit,
    select: req.query.select,
    lean: req.query.lean,
  };

  try {
    const patients = await patientService.getPatients(params);
    res.status(200).send(patients);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   get patient by id
 * @route  GET /api/patient/get/:id
 * @access Private
 */
async function getPatient(req: Request, res: Response) {
  await param(config.VALIDATION.PATIENT.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.PATIENT.PARAMS.INVALID_ID)
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  const params = {
    populateArray: req.query.populateArray || [],
    select: req.query.select,
    lean: req.query.lean,
  };

  try {
    const patient = await patientService.getPatient(req.params.id, params);
    res.status(200).send(patient);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   create patient
 * @route  POST /api/patient/create
 * @access Private
 */
async function createPatient(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.PATIENT.BODY.PATIENT_FIRSTNAME)
      .notEmpty()
      .withMessage(config.VALIDATION.PATIENT.ERROR.REQUIRED_PATIENT)
      .run(req),
    body(config.VALIDATION.PATIENT.BODY.PATIENT_LASTNAME)
      .notEmpty()
      .withMessage(config.VALIDATION.PATIENT.ERROR.REQUIRED_PATIENT)
      .run(req),
    body(config.VALIDATION.PATIENT.BODY.PATIENT_MIDDLENAME)
      .notEmpty()
      .withMessage(config.VALIDATION.PATIENT.ERROR.REQUIRED_PATIENT)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const newPatient = await patientService.createPatient(req.body);
    (req as any).io.emit("patientCreated", newPatient);
    res.status(200).send(newPatient);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   update patient
 * @route  PUT /api/patient/update
 * @access Private
 */
async function updatePatient(req: Request, res: Response) {
  try {
    const updatedPatient = await patientService.updatePatient(req.body);
    (req as any).io.emit("patientUpdated", updatedPatient);
    res.status(200).send(updatedPatient);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   remove patient
 * @route  DELETE /api/patient/remove/:id
 * @access Private
 */
async function removePatient(req: Request, res: Response) {
  await param(config.VALIDATION.PATIENT.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.PATIENT.PARAMS.INVALID_ID)
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const removedPatient = await patientService.removePatient(req.params.id);
    res.status(200).send(removedPatient);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   search patient
 * @route  POST /api/patient/search
 * @access Private
 */
async function searchPatient(req: Request, res: Response) {
  try {
    const searchedPatient = await patientService.searchPatient(req.body);
    res.status(200).send(searchedPatient);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   add chief complaint to patient
 * @route  POST /api/patient/chiefcomplaint
 * @access Private
 */

async function addToSetChiefComplaint(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.PATIENT.BODY.ID)
      .notEmpty()
      .withMessage(config.VALIDATION.PATIENT.ERROR.REQUIRED_PATIENT_ID)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const updatedPatient = await patientService.addToSetChiefComplaint(req.body);
    res.status(200).send(updatedPatient);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   add diagnosis to patient
 * @route  POST /api/patient/diagnosis
 * @access Private
 */

async function addToSetDiagnosis(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.PATIENT.BODY.ID)
      .notEmpty()
      .withMessage(config.VALIDATION.PATIENT.ERROR.REQUIRED_PATIENT_ID)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const updatedPatient = await patientService.addToSetDiagnosis(req.body);
    res.status(200).send(updatedPatient);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   add bhw to patient
 * @route  POST /api/patient/bhw
 * @access Private
 */

async function addToSetBhw(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.PATIENT.BODY.ID)
      .notEmpty()
      .withMessage(config.VALIDATION.PATIENT.ERROR.REQUIRED_PATIENT_ID)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const updatedPatient = await patientService.addToSetBhw(req.body);
    res.status(200).send(updatedPatient);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}
