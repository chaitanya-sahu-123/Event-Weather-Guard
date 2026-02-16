import express from "express";
import { generateEventForecast } from "../controllers/eventController.js";
import validateEvent from "../middleware/validateEvent.js";
import eventLimiter from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/event-forecast", eventLimiter, validateEvent, generateEventForecast);

export default router;