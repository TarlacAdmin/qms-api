import express, { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import queueService from "../services/queueService";
import { API_ENDPOINTS } from "../config/endpointsConfig";
import { config } from "../config/config";

const router = express.Router();

router.get(API_ENDPOINTS.QUEUE.GET_ALL, getAllQueues);
router.get(API_ENDPOINTS.QUEUE.GET_TOTAL, getTotalQueuesNumber);
router.get(API_ENDPOINTS.QUEUE.GET_BY_ID, getById);
router.post(API_ENDPOINTS.QUEUE.CREATE, create);
router.post(API_ENDPOINTS.QUEUE.SEARCH, search);
router.put(API_ENDPOINTS.QUEUE.UPDATE, update);
router.delete(API_ENDPOINTS.QUEUE.REMOVE_BY_ID, remove);

export default router;

/*
 * @desc   get all queues
 * @route  GET /api/queue/get/all
 * @access Private
 */
async function getAllQueues(req: Request, res: Response) {
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
    const queues = await queueService.getAllQueues(params);
    res.status(200).send(queues);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

// nagprapractice lang po ako ng mga aggregation queries, dedelete ko rin po ito HAHAHAHHA
async function getTotalQueuesNumber(req: Request, res: Response) {
  try {
    const total = await queueService.getTotalQueuesNumber();
    res.status(200).send(total);
  } catch (error) {
    throw error;
  }
}

/*
 * @desc   get queue by id
 * @route  GET /api/queue/get/:id
 * @access Private
 */
async function getById(req: Request, res: Response) {
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
    const queue = await queueService.getById(req.params.id, params);
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
async function create(req: Request, res: Response) {
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
    const newQueue = await queueService.create(req.body);
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
async function update(req: Request, res: Response) {
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
    const updatedQueue = await queueService.update(req.body);
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
async function remove(req: Request, res: Response) {
  await param(config.VALIDATION.QUEUE.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.QUEUE.PARAMS.INVALID_ID)
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const removedQueue = await queueService.remove(req.params.id);
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
 * @route  DELETE /api/queue/search
 * @access Private
 */
async function search(req: Request, res: Response) {
  try {
    const searchedQueues = await queueService.search(req.body);
    res.status(200).send(searchedQueues);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}
