import express, { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import videoService from "../services/videoService";
import { API_ENDPOINTS } from "../config/endpointsConfig";
import { config } from "../config/config";

const router = express.Router();

router.get(API_ENDPOINTS.VIDEO.GET_ALL, getAllVideo);
router.get(API_ENDPOINTS.VIDEO.GET_BY_ID, getById);
router.post(API_ENDPOINTS.VIDEO.CREATE, create);
router.post(API_ENDPOINTS.VIDEO.SEARCH, search);
router.put(API_ENDPOINTS.VIDEO.UPDATE, update);
router.delete(API_ENDPOINTS.VIDEO.REMOVE_BY_ID, remove);

export default router;

/*
 * @desc   get all video
 * @route  GET /api/video/get/all
 * @access Private
 */
async function getAllVideo(req: Request, res: Response) {
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
    const video = await videoService.getAllVideo(params);
    res.status(200).send(video);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   get video by id
 * @route  GET /api/video/get/:id
 * @access Private
 */
async function getById(req: Request, res: Response) {
  await param(config.VALIDATION.VIDEO.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.VIDEO.PARAMS.INVALID_ID)
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
    const video = await videoService.getById(req.params.id, params);
    res.status(200).send(video);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   create video
 * @route  POST /api/video/create
 * @access Private
 */
async function create(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.VIDEO.BODY.VIDEO_URL)
      .notEmpty()
      .withMessage(config.VALIDATION.VIDEO.ERROR.REQUIRED_VIDEO)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const newVideo = await videoService.create(req.body);
    (req as any).io.emit("videoCreated", newVideo);
    res.status(200).send(newVideo);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   update video
 * @route  PUT /api/video/update
 * @access Private
 */
async function update(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.VIDEO.BODY.VIDEO_URL)
      .notEmpty()
      .withMessage(config.VALIDATION.VIDEO.ERROR.REQUIRED_VIDEO)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const updatedVideo = await videoService.update(req.body);
    (req as any).io.emit("videoUpdated", updatedVideo);
    res.status(200).send(updatedVideo);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   remove video
 * @route  DELETE /api/video/remove/:id
 * @access Private
 */
async function remove(req: Request, res: Response) {
  await param(config.VALIDATION.VIDEO.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.VIDEO.PARAMS.INVALID_ID)
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const removedVideo = await videoService.remove(req.params.id);
    res.status(200).send(removedVideo);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   search video
 * @route  DELETE /api/video/search
 * @access Private
 */
async function search(req: Request, res: Response) {
  try {
    const searchedVideo = await videoService.search(req.body);
    res.status(200).send(searchedVideo);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}
