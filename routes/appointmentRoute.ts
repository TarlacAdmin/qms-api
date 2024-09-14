import express, { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import appointmentService from "../services/appointmentService";
import { API_ENDPOINTS } from "../config/endpointsConfig";
import { config } from "../config/config";
import { SearchParams } from "../types/searchTypes";

const router = express.Router();

router.get(API_ENDPOINTS.APPOINTMENT.GET_TOTAL, getTotalAppointments);
router.get(API_ENDPOINTS.APPOINTMENT.GET_ALL, getAppointments);
router.get(API_ENDPOINTS.APPOINTMENT.GET_BY_ID, getAppointment);
router.post(API_ENDPOINTS.APPOINTMENT.CREATE, createAppointment);
router.put(API_ENDPOINTS.APPOINTMENT.UPDATE, updateAppointment);
router.delete(API_ENDPOINTS.APPOINTMENT.REMOVE_BY_ID, removeAppointment);
router.post(API_ENDPOINTS.APPOINTMENT.SEARCH, searchAppointment);

export default router;

/*
 * @desc   get total appointments
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
async function getAppointments(req: Request, res: Response) {
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
    const patients = await appointmentService.getAppointments(params);
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
async function getAppointment(req: Request, res: Response) {
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
    const patient = await appointmentService.getAppointment(req.params.id, params);
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
async function createAppointment(req: Request, res: Response) {
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
    const newPatient = await appointmentService.createAppointment(req.body);
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
async function updateAppointment(req: Request, res: Response) {
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
    const updatedPatient = await appointmentService.updateAppointment(req.body);
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
async function removeAppointment(req: Request, res: Response) {
  await param(config.VALIDATION.APPOINTMENT.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.APPOINTMENT.PARAMS.INVALID_ID)
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const removedPatient = await appointmentService.removeAppointment(req.params.id);
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
 * @route  POST /api/appointment/search
 * @access Private
 */
async function searchAppointment(req: Request, res: Response) {
  try {
    const searchParams: SearchParams = {
      searchType: req.body.searchType,
      textQuery: req.body.textQuery,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      query: req.body.query,
      match: req.body.match,
      populateArray: req.body.populateArray,
      projection: req.body.projection,
      options: req.body.options,
      sort: req.body.sort,
      limit: req.body.limit,
      lean: req.body.lean,
    };
    const searchResults = await appointmentService.searchAppointment(searchParams);
    res.status(200).json(searchResults);
  } catch (error) {
    console.error("Route searchAppointment error:", error);
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred during the searchAppointment" });
    }
  }
}
