import { fetchHourlyForecast } from "../services/weatherService.js";
import { filterForecastByWindow } from "../utils/timeUtils.js";
import { classifyEvent } from "../services/classificationService.js";
import generateSummary from "../utils/summaryGenerator.js";

export const generateEventForecast = async (req, res, next) => {
  try {
    const { name, location, start_time, end_time } = req.body;
    const hourlyData = await fetchHourlyForecast(
      location.latitude,
      location.longitude
    );

    const eventWindowForecast = filterForecastByWindow(
      hourlyData,
      start_time,
      end_time
    );

    if (!eventWindowForecast.length) {
      return res.status(400).json({
        error: "Event outside forecast range",
      });
    }

    const result = classifyEvent(eventWindowForecast);
    const summary = generateSummary(result.classification, result.reasons);

    return res.json({
      event: name,
      classification: result.classification,
      severity_score: result.severityScore,
      summary,
      reason: result.reasons,
      event_window_forecast: eventWindowForecast,
    });
  } catch (error) {
    next(error);
  }
};