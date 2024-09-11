import express, { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import chiefComplaintService from "../services/chiefComplaintService";
import { API_ENDPOINTS } from "../config/endpointsConfig";
import { config } from "../config/config";

const router = express.Router();

router.get(API_ENDPOINTS.CHIEFCOMPLAINT.GET_ALL, getAllChiefComplaint);
router.get(API_ENDPOINTS.CHIEFCOMPLAINT.GET_BY_ID, getById);
router.post(API_ENDPOINTS.CHIEFCOMPLAINT.CREATE, create);
router.post(API_ENDPOINTS.CHIEFCOMPLAINT.SEARCH, search);
router.put(API_ENDPOINTS.CHIEFCOMPLAINT.UPDATE, update);
router.delete(API_ENDPOINTS.CHIEFCOMPLAINT.REMOVE_BY_ID, remove);

export default router;

/*
 * @desc   get all chiefcomplaint
 * @route  GET /api/chiefcomplaint/get/all
 * @access Private
 */
async function getAllChiefComplaint(req: Request, res: Response) {
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
    const chiefcomplaint = await chiefComplaintService.getAllChiefComplaint(params);
    res.status(200).send(chiefcomplaint);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   get chiefcomplaint by id
 * @route  GET /api/chiefcomplaint/get/:id
 * @access Private
 */
async function getById(req: Request, res: Response) {
  await param(config.VALIDATION.CHIEFCOMPLAINT.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.CHIEFCOMPLAINT.PARAMS.INVALID_ID)
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
    const chiefcomplaint = await chiefComplaintService.getById(req.params.id, params);
    res.status(200).send(chiefcomplaint);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   create chiefcomplaint
 * @route  POST /api/chiefcomplaint/create
 * @access Private
 */
async function create(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.CHIEFCOMPLAINT.BODY.CHIEFCOMPLAINT_TEXT)
      .notEmpty()
      .withMessage(config.VALIDATION.CHIEFCOMPLAINT.ERROR.REQUIRED_CHIEFCOMPLAINT)
      .run(req),
    body(config.VALIDATION.CHIEFCOMPLAINT.BODY.CHIEFCOMPLAINT_SEVERITY)
      .notEmpty()
      .withMessage(config.VALIDATION.CHIEFCOMPLAINT.ERROR.REQUIRED_CHIEFCOMPLAINT)
      .run(req),
    body(config.VALIDATION.CHIEFCOMPLAINT.BODY.CHIEFCOMPLAINT_ONSETDATETIME)
      .notEmpty()
      .withMessage(config.VALIDATION.CHIEFCOMPLAINT.ERROR.REQUIRED_CHIEFCOMPLAINT)
      .run(req),
    body(config.VALIDATION.CHIEFCOMPLAINT.BODY.CHIEFCOMPLAINT_BODYSITE)
      .notEmpty()
      .withMessage(config.VALIDATION.CHIEFCOMPLAINT.ERROR.REQUIRED_CHIEFCOMPLAINT)
      .run(req),
    body(config.VALIDATION.CHIEFCOMPLAINT.BODY.CHIEFCOMPLAINT_ABATEMENTDATETIME)
      .notEmpty()
      .withMessage(config.VALIDATION.CHIEFCOMPLAINT.ERROR.REQUIRED_CHIEFCOMPLAINT)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const newChiefComplaint = await chiefComplaintService.create(req.body);
    res.status(200).send(newChiefComplaint);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   update chiefcomplaint
 * @route  PUT /api/chiefcomplaint/update
 * @access Private
 */
async function update(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.CHIEFCOMPLAINT.BODY.CHIEFCOMPLAINT_TEXT)
      .notEmpty()
      .withMessage(config.VALIDATION.CHIEFCOMPLAINT.ERROR.REQUIRED_CHIEFCOMPLAINT)
      .run(req),
    body(config.VALIDATION.CHIEFCOMPLAINT.BODY.CHIEFCOMPLAINT_SEVERITY)
      .notEmpty()
      .withMessage(config.VALIDATION.CHIEFCOMPLAINT.ERROR.REQUIRED_CHIEFCOMPLAINT)
      .run(req),
    body(config.VALIDATION.CHIEFCOMPLAINT.BODY.CHIEFCOMPLAINT_ONSETDATETIME)
      .notEmpty()
      .withMessage(config.VALIDATION.CHIEFCOMPLAINT.ERROR.REQUIRED_CHIEFCOMPLAINT)
      .run(req),
    body(config.VALIDATION.CHIEFCOMPLAINT.BODY.CHIEFCOMPLAINT_BODYSITE)
      .notEmpty()
      .withMessage(config.VALIDATION.CHIEFCOMPLAINT.ERROR.REQUIRED_CHIEFCOMPLAINT)
      .run(req),
    body(config.VALIDATION.CHIEFCOMPLAINT.BODY.CHIEFCOMPLAINT_ABATEMENTDATETIME)
      .notEmpty()
      .withMessage(config.VALIDATION.CHIEFCOMPLAINT.ERROR.REQUIRED_CHIEFCOMPLAINT)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const updatedChiefComplaint = await chiefComplaintService.update(req.body);
    res.status(200).send(updatedChiefComplaint);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   remove chiefcomplaint
 * @route  DELETE /api/chiefcomplaint/remove/:id
 * @access Private
 */
async function remove(req: Request, res: Response) {
  await param(config.VALIDATION.CHIEFCOMPLAINT.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.CHIEFCOMPLAINT.PARAMS.INVALID_ID)
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const removedChiefComplaint = await chiefComplaintService.remove(req.params.id);
    res.status(200).send(removedChiefComplaint);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   search chiefcomplaint
 * @route  POST /api/chiefcomplaint/search
 * @access Private
 */
async function search(req: Request, res: Response) {
  try {
    const searchedChiefComplaint = await chiefComplaintService.search(req.body);
    res.status(200).send(searchedChiefComplaint);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}
