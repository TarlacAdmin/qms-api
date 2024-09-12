import express, { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import doctorService from "../services/doctorService";
import { API_ENDPOINTS } from "../config/endpointsConfig";
import { config } from "../config/config";

const router = express.Router();

router.get(API_ENDPOINTS.DOCTOR.GET_BY_ID, getDoctor);
router.get(API_ENDPOINTS.DOCTOR.GET_ALL, getDoctors);
router.post(API_ENDPOINTS.DOCTOR.CREATE, createDoctor);
router.put(API_ENDPOINTS.DOCTOR.UPDATE, updateDoctor);
router.delete(API_ENDPOINTS.DOCTOR.REMOVE_BY_ID, removeDoctor);
router.post(API_ENDPOINTS.DOCTOR.SEARCH, searchDoctor);

export default router;

/*
 * @desc   get doctor by id
 * @route  GET /api/doctor/get/:id
 * @access Private
 */
async function getDoctor(req: Request, res: Response) {
  await param(config.VALIDATION.DOCTOR.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.DOCTOR.PARAMS.INVALID_ID)
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
    const patient = await doctorService.getDoctor(req.params.id, params);
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
 * @desc   get all doctor
 * @route  GET /api/doctor/get/all
 * @access Private
 */
async function getDoctors(req: Request, res: Response) {
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
    const patients = await doctorService.getDoctors(params);
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
 * @desc   create doctor
 * @route  POST /api/doctor/create
 * @access Private
 */
async function createDoctor(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.DOCTOR.BODY.DOCTOR_FIRSTNAME)
      .notEmpty()
      .withMessage(config.VALIDATION.DOCTOR.ERROR.REQUIRED_DOCTOR)
      .run(req),
    body(config.VALIDATION.DOCTOR.BODY.DOCTOR_LASTNAME)
      .notEmpty()
      .withMessage(config.VALIDATION.DOCTOR.ERROR.REQUIRED_DOCTOR)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const newPatient = await doctorService.createDoctor(req.body);
    (req as any).io.emit("doctorCreated", newPatient);
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
 * @desc   update doctor
 * @route  PUT /api/doctor/update
 * @access Private
 */
async function updateDoctor(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.DOCTOR.BODY.DOCTOR_FIRSTNAME)
      .notEmpty()
      .withMessage(config.VALIDATION.DOCTOR.ERROR.REQUIRED_DOCTOR)
      .run(req),
    body(config.VALIDATION.DOCTOR.BODY.DOCTOR_LASTNAME)
      .notEmpty()
      .withMessage(config.VALIDATION.DOCTOR.ERROR.REQUIRED_DOCTOR)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const updatedPatient = await doctorService.updateDoctor(req.body);
    (req as any).io.emit("doctorUpdated", updatedPatient);
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
 * @desc   remove doctor
 * @route  DELETE /api/doctor/remove/:id
 * @access Private
 */
async function removeDoctor(req: Request, res: Response) {
  await param(config.VALIDATION.DOCTOR.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.DOCTOR.PARAMS.INVALID_ID)
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const removedPatient = await doctorService.removeDoctor(req.params.id);
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
 * @desc   search doctor
 * @route  POST /api/doctor/search
 * @access Private
 */
async function searchDoctor(req: Request, res: Response) {
  try {
    const searchedDoctor = await doctorService.searchDoctor(req.body);
    res.status(200).send(searchedDoctor);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}
