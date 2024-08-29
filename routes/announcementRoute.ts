import express, { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import announcementService from "../services/announcementService";
import { API_ENDPOINTS } from "../config/endpointsConfig";
import { config } from "../config/config";

const router = express.Router();

router.get(API_ENDPOINTS.ANNOUNCEMENT.GET_ALL, getAllAnnouncement);
router.get(API_ENDPOINTS.ANNOUNCEMENT.GET_BY_ID, getById);
router.post(API_ENDPOINTS.ANNOUNCEMENT.CREATE, create);
router.post(API_ENDPOINTS.ANNOUNCEMENT.SEARCH, search);
router.put(API_ENDPOINTS.ANNOUNCEMENT.UPDATE, update);
router.delete(API_ENDPOINTS.ANNOUNCEMENT.REMOVE_BY_ID, remove);

export default router;

/*
 * @desc   get all announcement
 * @route  GET /api/announcement/get/all
 * @access Private
 */
async function getAllAnnouncement(req: Request, res: Response) {
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
    const announcements = await announcementService.getAllAnnouncement(params);
    res.status(200).send(announcements);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   get announcement by id
 * @route  GET /api/announcement/get/:id
 * @access Private
 */
async function getById(req: Request, res: Response) {
  await param(config.VALIDATION.ANNOUNCEMENT.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.ANNOUNCEMENT.PARAMS.INVALID_ID)
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
    const announcements = await announcementService.getById(req.params.id, params);
    res.status(200).send(announcements);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   create announcement
 * @route  POST /api/announcement/create
 * @access Private
 */
async function create(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.ANNOUNCEMENT.BODY.ANNOUNCEMENT_HEADLINE)
      .notEmpty()
      .withMessage(config.VALIDATION.ANNOUNCEMENT.ERROR.REQUIRED_ANNOUNCEMENT)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const newAnnouncement = await announcementService.create(req.body);
    (req as any).io.emit("announcementCreated", newAnnouncement);
    res.status(200).send(newAnnouncement);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   update announcement
 * @route  PUT /api/announcement/update
 * @access Private
 */
async function update(req: Request, res: Response) {
  await Promise.all([
    body(config.VALIDATION.ANNOUNCEMENT.BODY.ANNOUNCEMENT_HEADLINE)
      .notEmpty()
      .withMessage(config.VALIDATION.ANNOUNCEMENT.ERROR.REQUIRED_ANNOUNCEMENT)
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const updatedAnnouncement = await announcementService.update(req.body);
    (req as any).io.emit("announcementUpdated", updatedAnnouncement);
    res.status(200).send(updatedAnnouncement);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   remove announcement
 * @route  DELETE /api/announcement/remove/:id
 * @access Private
 */
async function remove(req: Request, res: Response) {
  await param(config.VALIDATION.ANNOUNCEMENT.PARAMS.ID)
    .isMongoId()
    .withMessage(config.VALIDATION.ANNOUNCEMENT.PARAMS.INVALID_ID)
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  try {
    const removedAnnouncement = await announcementService.remove(req.params.id);
    res.status(200).send(removedAnnouncement);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}

/*
 * @desc   search announcement
 * @route  DELETE /api/announcement/search
 * @access Private
 */
async function search(req: Request, res: Response) {
  try {
    const searchedAnnouncement = await announcementService.search(req.body);
    res.status(200).send(searchedAnnouncement);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "An unknown error occurred" });
    }
  }
}
