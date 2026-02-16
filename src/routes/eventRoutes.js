import express from "express";
import { generateEventForecast } from "../controllers/eventController.js";
import validateEvent from "../middleware/validateEvent.js";

const router = express.Router();

router.post("/event-forecast", validateEvent, generateEventForecast);

export default router;