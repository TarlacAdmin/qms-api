import express, { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import patientService from "../services/patientService";
import { API_ENDPOINTS } from "../config/endpointsConfig";
import { config } from "../config/config";

const router = express.Router();

router.get(API_ENDPOINTS.PATIENT.GET_ALL, getAllPatients);
router.get(API_ENDPOINTS.PATIENT.GET_BY_ID, getById);
router.post(API_ENDPOINTS.PATIENT.CREATE, create);
router.post(API_ENDPOINTS.PATIENT.SEARCH, search);
router.put(API_ENDPOINTS.PATIENT.UPDATE, update);
router.delete(API_ENDPOINTS.PATIENT.REMOVE_BY_ID, remove);

export default router;

/*
 * @desc   get all patient
 * @route  GET /api/patient/get/all
 * @access Private
 */
async function getAllPatients(req: Request, res: Response) {
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
    const patients = await patientService.getAllPatients(params);
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
 * @desc   get queue by id
 * @route  GET /api/queue/get/:id
 * @access Private
 */
async function getById(req: Request, res: Response) {
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
    const patient = await patientService.getById(req.params.id, params);
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
 * @desc   create queue
 * @route  POST /api/queue/create
 * @access Private
 */
async function create(req: Request, res: Response) {
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
    const newPatient = await patientService.create(req.body);
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
 * @desc   update queue
 * @route  PUT /api/queue/update
 * @access Private
 */
async function update(req: Request, res: Response) {
  // await body(config.VALIDATION.QUEUE.BODY.QUEUE_NUMBER)
  //   .notEmpty()
  //   .withMessage(config.VALIDATION.QUEUE.ERROR.REQUIRED_QUEUE)
  //   .run(req);

  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).send({ error: errors.array() });
  // }

  try {
    const updatedPatient = await patientService.update(req.body);
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
 * @desc   remove queue
 * @route  DELETE /api/queue/remove/:id
 * @access Private
 */
async function remove(req: Request, res: Response) {
  await param(config.VALIDATION.PATIENT.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.PATIENT.PARAMS.INVALID_ID)
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const removedPatient = await patientService.remove(req.params.id);
    res.status(200).send(removedPatient);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

async function search(req: Request, res: Response) {
  try {
    const searchedPatient = await patientService.search(req.body);
    res.status(200).send(searchedPatient);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}
