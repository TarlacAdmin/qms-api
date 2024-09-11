import express, { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import diagnosisService from "../services/diagnosisService";
import { API_ENDPOINTS } from "../config/endpointsConfig";
import { config } from "../config/config";

const router = express.Router();

router.get(API_ENDPOINTS.DIAGNOSIS.GET_ALL, getAllDiagnosis);
router.get(API_ENDPOINTS.DIAGNOSIS.GET_BY_ID, getById);
router.post(API_ENDPOINTS.DIAGNOSIS.CREATE, create);
router.post(API_ENDPOINTS.DIAGNOSIS.SEARCH, search);
router.put(API_ENDPOINTS.DIAGNOSIS.UPDATE, update);
router.delete(API_ENDPOINTS.DIAGNOSIS.REMOVE_BY_ID, remove);

export default router;

/*
 * @desc   get all diagnosis
 * @route  GET /api/diagnosis/get/all
 * @access Private
 */
async function getAllDiagnosis(req: Request, res: Response) {
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
    const diagnosis = await diagnosisService.getAllDiagnosis(params);
    res.status(200).send(diagnosis);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   get diagnosis by id
 * @route  GET /api/diagnosis/get/:id
 * @access Private
 */
async function getById(req: Request, res: Response) {
  await param(config.VALIDATION.DIAGNOSIS.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.DIAGNOSIS.PARAMS.INVALID_ID)
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
    const diagnosis = await diagnosisService.getById(req.params.id, params);
    res.status(200).send(diagnosis);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   create diagnosis
 * @route  POST /api/diagnosis/create
 * @access Private
 */
async function create(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.DIAGNOSIS.BODY.DIAGNOSIS_VERIFICATIONSTATUS)
      .notEmpty()
      .withMessage(config.VALIDATION.DIAGNOSIS.ERROR.REQUIRED_DIAGNOSIS)
      .run(req),
    body(config.VALIDATION.DIAGNOSIS.BODY.DIAGNOSIS_SEVERITY)
      .notEmpty()
      .withMessage(config.VALIDATION.DIAGNOSIS.ERROR.REQUIRED_DIAGNOSIS)
      .run(req),
    body(config.VALIDATION.DIAGNOSIS.BODY.DIAGNOSIS_ONSETDATETIME)
      .notEmpty()
      .withMessage(config.VALIDATION.DIAGNOSIS.ERROR.REQUIRED_DIAGNOSIS)
      .run(req),
    body(config.VALIDATION.DIAGNOSIS.BODY.DIAGNOSIS_DESCRIPTION)
      .notEmpty()
      .withMessage(config.VALIDATION.DIAGNOSIS.ERROR.REQUIRED_DIAGNOSIS)
      .run(req),
    body(config.VALIDATION.DIAGNOSIS.BODY.DIAGNOSIS_CODE)
      .notEmpty()
      .withMessage(config.VALIDATION.DIAGNOSIS.ERROR.REQUIRED_DIAGNOSIS)
      .run(req),
    body(config.VALIDATION.DIAGNOSIS.BODY.DIAGNOSIS_CLINICALSTATUS)
      .notEmpty()
      .withMessage(config.VALIDATION.DIAGNOSIS.ERROR.REQUIRED_DIAGNOSIS)
      .run(req),
    body(config.VALIDATION.DIAGNOSIS.BODY.DIAGNOSIS_CATEGORY)
      .notEmpty()
      .withMessage(config.VALIDATION.DIAGNOSIS.ERROR.REQUIRED_DIAGNOSIS)
      .run(req),
    body(config.VALIDATION.DIAGNOSIS.BODY.DIAGNOSIS_BODYSITE)
      .notEmpty()
      .withMessage(config.VALIDATION.DIAGNOSIS.ERROR.REQUIRED_DIAGNOSIS)
      .run(req),
    body(config.VALIDATION.DIAGNOSIS.BODY.DIAGNOSIS_ABATEMENTDATETIME)
      .notEmpty()
      .withMessage(config.VALIDATION.DIAGNOSIS.ERROR.REQUIRED_DIAGNOSIS)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const newDiagnosis = await diagnosisService.create(req.body);
    res.status(200).send(newDiagnosis);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   update diagnosis
 * @route  PUT /api/diagnosis/update
 * @access Private
 */
async function update(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.DIAGNOSIS.BODY.DIAGNOSIS_VERIFICATIONSTATUS)
      .notEmpty()
      .withMessage(config.VALIDATION.DIAGNOSIS.ERROR.REQUIRED_DIAGNOSIS)
      .run(req),
    body(config.VALIDATION.DIAGNOSIS.BODY.DIAGNOSIS_SEVERITY)
      .notEmpty()
      .withMessage(config.VALIDATION.DIAGNOSIS.ERROR.REQUIRED_DIAGNOSIS)
      .run(req),
    body(config.VALIDATION.DIAGNOSIS.BODY.DIAGNOSIS_ONSETDATETIME)
      .notEmpty()
      .withMessage(config.VALIDATION.DIAGNOSIS.ERROR.REQUIRED_DIAGNOSIS)
      .run(req),
    body(config.VALIDATION.DIAGNOSIS.BODY.DIAGNOSIS_DESCRIPTION)
      .notEmpty()
      .withMessage(config.VALIDATION.DIAGNOSIS.ERROR.REQUIRED_DIAGNOSIS)
      .run(req),
    body(config.VALIDATION.DIAGNOSIS.BODY.DIAGNOSIS_CODE)
      .notEmpty()
      .withMessage(config.VALIDATION.DIAGNOSIS.ERROR.REQUIRED_DIAGNOSIS)
      .run(req),
    body(config.VALIDATION.DIAGNOSIS.BODY.DIAGNOSIS_CLINICALSTATUS)
      .notEmpty()
      .withMessage(config.VALIDATION.DIAGNOSIS.ERROR.REQUIRED_DIAGNOSIS)
      .run(req),
    body(config.VALIDATION.DIAGNOSIS.BODY.DIAGNOSIS_CATEGORY)
      .notEmpty()
      .withMessage(config.VALIDATION.DIAGNOSIS.ERROR.REQUIRED_DIAGNOSIS)
      .run(req),
    body(config.VALIDATION.DIAGNOSIS.BODY.DIAGNOSIS_BODYSITE)
      .notEmpty()
      .withMessage(config.VALIDATION.DIAGNOSIS.ERROR.REQUIRED_DIAGNOSIS)
      .run(req),
    body(config.VALIDATION.DIAGNOSIS.BODY.DIAGNOSIS_ABATEMENTDATETIME)
      .notEmpty()
      .withMessage(config.VALIDATION.DIAGNOSIS.ERROR.REQUIRED_DIAGNOSIS)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const updatedDiagnosis = await diagnosisService.update(req.body);
    res.status(200).send(updatedDiagnosis);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   remove diagnosis
 * @route  DELETE /api/diagnosis/remove/:id
 * @access Private
 */
async function remove(req: Request, res: Response) {
  await param(config.VALIDATION.DIAGNOSIS.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.DIAGNOSIS.PARAMS.INVALID_ID)
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const removedDiagnosis = await diagnosisService.remove(req.params.id);
    res.status(200).send(removedDiagnosis);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   search diagnosis
 * @route  POST /api/diagnosis/search
 * @access Private
 */
async function search(req: Request, res: Response) {
  try {
    const searchedDiagnosis = await diagnosisService.search(req.body);
    res.status(200).send(searchedDiagnosis);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}
