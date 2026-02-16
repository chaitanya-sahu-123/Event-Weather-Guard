import { fetchHourlyForecast } from "../services/weatherService.js";
import { filterForecastByWindow } from "../utils/timeUtils.js";
import { classifyEvent } from "../services/classificationService.js";

export const generateEventForecast = async (req, res) => {
  try {
    const { name, location, start_time, end_time } = req.body;

    if (!location || !start_time || !end_time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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
      return res
        .status(400)
        .json({ error: "Event outside forecast range" });
    }

    const result = classifyEvent(eventWindowForecast);

    return res.json({
      event: name,
      classification: result.classification,
      severity_score: result.severityScore,
      summary: `${result.classification} weather conditions expected`,
      reason: result.reasons,
      event_window_forecast: eventWindowForecast,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
