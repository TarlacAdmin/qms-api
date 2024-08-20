import express, { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import appointmentService from "../services/appointmentService";
import { API_ENDPOINTS } from "../config/endpointsConfig";
import { config } from "../config/config";

const router = express.Router();

router.get(API_ENDPOINTS.APPOINTMENT.GET_ALL, getAllAppointments);
router.get(API_ENDPOINTS.APPOINTMENT.GET_TOTAL, getTotalAppointments);
router.get(API_ENDPOINTS.APPOINTMENT.GET_BY_ID, getById);
router.post(API_ENDPOINTS.APPOINTMENT.CREATE, create);
router.post(API_ENDPOINTS.APPOINTMENT.SEARCH, search);
router.put(API_ENDPOINTS.APPOINTMENT.UPDATE, update);
router.delete(API_ENDPOINTS.APPOINTMENT.REMOVE_BY_ID, remove);

export default router;

/*
 * @desc   get total appointments and appointments per doctor
 * @route  GET /api/appointment/get/total
 * @access Private
 */
async function getTotalAppointments(req: Request, res: Response) {
  try {
    const result = await appointmentService.getTotalAppointments();
    res.status(200).send(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   get all appointment
 * @route  GET /api/appointment/get/all
 * @access Private
 */
async function getAllAppointments(req: Request, res: Response) {
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
    const patients = await appointmentService.getAllAppointments(params);
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
 * @desc   get appointment by id
 * @route  GET /api/appointment/get/:id
 * @access Private
 */
async function getById(req: Request, res: Response) {
  await param(config.VALIDATION.APPOINTMENT.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.APPOINTMENT.PARAMS.INVALID_ID)
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
    const patient = await appointmentService.getById(req.params.id, params);
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
 * @desc   create appointment
 * @route  POST /api/appointment/create
 * @access Private
 */
async function create(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.APPOINTMENT.BODY.APPOINTMENT_DATE)
      .notEmpty()
      .withMessage(config.VALIDATION.APPOINTMENT.ERROR.REQUIRED_APPOINTMENT)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const newPatient = await appointmentService.create(req.body);
    (req as any).io.emit("appointmentCreated", newPatient);
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
 * @desc   update appointment
 * @route  PUT /api/appointment/update
 * @access Private
 */
async function update(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.APPOINTMENT.BODY.APPOINTMENT_DATE)
      .notEmpty()
      .withMessage(config.VALIDATION.APPOINTMENT.ERROR.REQUIRED_APPOINTMENT)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const updatedPatient = await appointmentService.update(req.body);
    (req as any).io.emit("appointmentUpdated", updatedPatient);
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
 * @desc   remove appointment
 * @route  DELETE /api/appointment/remove/:id
 * @access Private
 */
async function remove(req: Request, res: Response) {
  await param(config.VALIDATION.APPOINTMENT.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.APPOINTMENT.PARAMS.INVALID_ID)
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const removedPatient = await appointmentService.remove(req.params.id);
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
 * @desc   search appointment
 * @route  DELETE /api/appointment/search
 * @access Private
 */
async function search(req: Request, res: Response) {
  try {
    const searchParams = {
      textQuery: req.body.textQuery,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      searchType: req.body.searchType, // 'patient', 'doctor', 'appointment', or 'all'
      sort: req.body.sort,
      limit: req.body.limit,
    };
    const searchedPatients = await appointmentService.search(searchParams);
    res.status(200).json(searchedPatients);
  } catch (error) {
    console.error("Route search error:", error);
    res.status(400).json({ error: "An error occurred during the search" });
  }
}
