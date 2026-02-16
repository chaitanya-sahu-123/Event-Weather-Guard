import express from "express";
import { generateEventForecast } from "../controllers/eventController.js";

const router = express.Router();

router.post("/event-forecast", generateEventForecast);

export default router;