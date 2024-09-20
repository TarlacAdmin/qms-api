import express, { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import specialDatesService from "../services/specialDatesService";
import { API_ENDPOINTS } from "../config/endpointsConfig";
import { config } from "../config/config";

const router = express.Router();

router.get(API_ENDPOINTS.SPECIALDATE.GET_ALL, getSpecialDates);
router.get(API_ENDPOINTS.SPECIALDATE.GET_BY_ID, getSpecialDate);
router.post(API_ENDPOINTS.SPECIALDATE.CREATE, createSpecialDate);
router.put(API_ENDPOINTS.SPECIALDATE.UPDATE, updateSpecialDate);
router.delete(API_ENDPOINTS.SPECIALDATE.REMOVE_BY_ID, removeSpecialDate);
router.post(API_ENDPOINTS.SPECIALDATE.SEARCH, searchSpecialDate);

export default router;

/*
 * @desc   get all specialdate
 * @route  GET /api/specialdate/get/all
 * @access Private
 */
async function getSpecialDates(req: Request, res: Response) {
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
    const specialDates = await specialDatesService.getSpecialDates(params);
    res.status(200).send(specialDates);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   get specialdate by id
 * @route  GET /api/specialdate/get/:id
 * @access Private
 */
async function getSpecialDate(req: Request, res: Response) {
  await param(config.VALIDATION.SPECIALDATE.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.SPECIALDATE.PARAMS.INVALID_ID)
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
    const specialDates = await specialDatesService.getSpecialDate(req.params.id, params);
    res.status(200).send(specialDates);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   create specialdate
 * @route  POST /api/specialdate/create
 * @access Private
 */
async function createSpecialDate(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.SPECIALDATE.BODY.SPECIALDATE_DATE)
      .notEmpty()
      .withMessage(config.VALIDATION.SPECIALDATE.ERROR.REQUIRED_SPECIALDATE)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const newSpecialDates = await specialDatesService.createSpecialDate(req.body);
    (req as any).io.emit("specialDatesCreated", newSpecialDates);
    res.status(200).send(newSpecialDates);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   update specialdate
 * @route  PUT /api/specialdate/update
 * @access Private
 */
async function updateSpecialDate(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.SPECIALDATE.BODY.SPECIALDATE_DATE)
      .notEmpty()
      .withMessage(config.VALIDATION.SPECIALDATE.ERROR.REQUIRED_SPECIALDATE)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const updatedSpecialDates = await specialDatesService.updateSpecialDate(req.body);
    (req as any).io.emit("specialDatesUpdated", updatedSpecialDates);
    res.status(200).send(updatedSpecialDates);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   remove specialdate
 * @route  DELETE /api/specialdate/remove/:id
 * @access Private
 */
async function removeSpecialDate(req: Request, res: Response) {
  await param(config.VALIDATION.SPECIALDATE.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.SPECIALDATE.PARAMS.INVALID_ID)
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const removedSpecialDates = await specialDatesService.removeSpecialDate(req.params.id);
    res.status(200).send(removedSpecialDates);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   search specialdate
 * @route  POST /api/specialdate/search
 * @access Private
 */
async function searchSpecialDate(req: Request, res: Response) {
  try {
    const searchedSpecialDates = await specialDatesService.searchSpecialDate(req.body);
    res.status(200).send(searchedSpecialDates);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}
