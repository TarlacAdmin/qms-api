import express, { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import queueService from "../services/queueService";
import { API_ENDPOINTS } from "../config/endpointsConfig";
import { config } from "../config/config";

const router = express.Router();

router.get(API_ENDPOINTS.QUEUE.GET_ALL, getQueues);
router.get(API_ENDPOINTS.QUEUE.GET_BY_ID, getQueue);
router.post(API_ENDPOINTS.QUEUE.CREATE, createQueue);
router.put(API_ENDPOINTS.QUEUE.UPDATE, updateQueue);
router.delete(API_ENDPOINTS.QUEUE.REMOVE_BY_ID, removeQueue);
router.post(API_ENDPOINTS.QUEUE.SEARCH, searchQueue);

export default router;

/*
 * @desc   get all queues
 * @route  GET /api/queue/get/all
 * @access Private
 */
async function getQueues(req: Request, res: Response) {
  const params = {
    query: req.query.query || {},
    queryArray: req.query.queryArray,
    queryArrayType: req.query.queryArrayType,
    populateArray: Array.isArray(req.query.populateArray)
      ? req.query.populateArray
      : [req.query.populateArray],
    sort: req.query.sort,
    limit: req.query.limit,
    select: req.query.select,
    lean: req.query.lean,
  };

  try {
    const queues = await queueService.getQueues(params);
    res.status(200).send(queues);
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
async function getQueue(req: Request, res: Response) {
  await param(config.VALIDATION.QUEUE.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.QUEUE.PARAMS.INVALID_ID)
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
    const queue = await queueService.getQueue(req.params.id, params);
    res.status(200).send(queue);
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
async function createQueue(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.QUEUE.BODY.PATIENT)
      .notEmpty()
      .withMessage(config.VALIDATION.QUEUE.ERROR.REQUIRED_QUEUE)
      .run(req),
    body(config.VALIDATION.QUEUE.BODY.DOCTOR)
      .notEmpty()
      .withMessage(config.VALIDATION.QUEUE.ERROR.REQUIRED_QUEUE)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const newQueue = await queueService.createQueue(req.body);
    (req as any).io.emit("queueCreated", newQueue);
    res.status(200).send(newQueue);
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
async function updateQueue(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.QUEUE.BODY.PATIENT)
      .notEmpty()
      .withMessage(config.VALIDATION.QUEUE.ERROR.REQUIRED_QUEUE)
      .run(req),
    body(config.VALIDATION.QUEUE.BODY.DOCTOR)
      .notEmpty()
      .withMessage(config.VALIDATION.QUEUE.ERROR.REQUIRED_QUEUE)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const updatedQueue = await queueService.updateQueue(req.body);
    (req as any).io.emit("queueUpdated", updatedQueue);
    res.status(200).send(updatedQueue);
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
async function removeQueue(req: Request, res: Response) {
  await param(config.VALIDATION.QUEUE.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.QUEUE.PARAMS.INVALID_ID)
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const removedQueue = await queueService.removeQueue(req.params.id);
    res.status(200).send(removedQueue);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   search queue
 * @route  POST /api/queue/search
 * @access Private
 */
async function searchQueue(req: Request, res: Response) {
  try {
    const searchedQueues = await queueService.searchQueue(req.body);
    res.status(200).send(searchedQueues);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}
