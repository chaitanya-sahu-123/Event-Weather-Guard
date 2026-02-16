import { CLASSIFICATION, WEATHER_THRESHOLDS,THUNDERSTORM_CODES } from "../config/constants.js";
import { calculateSeverityScore } from "../utils/severityUtils.js";

export const classifyEvent = (eventForecast) => {
  let maxRain = 0;
  let maxWind = 0;
  let reasons = [];
  let classification = CLASSIFICATION.SAFE;

  for (const hour of eventForecast) {
    maxRain = Math.max(maxRain, hour.rain_prob);
    maxWind = Math.max(maxWind, hour.wind_kmh);

    if (THUNDERSTORM_CODES.includes(hour.weathercode)) {
      classification = CLASSIFICATION.UNSAFE;
      reasons.push(`Thunderstorm expected at ${hour.time}`);
    }

    if (hour.rain_prob >= WEATHER_THRESHOLDS.HEAVY_RAIN) {
      classification = CLASSIFICATION.UNSAFE;
      reasons.push(
        `Heavy rain probability ${hour.rain_prob}% at ${hour.time}`
      );
    }

    if (hour.wind_kmh >= WEATHER_THRESHOLDS.HIGH_WIND) {
      classification = CLASSIFICATION.UNSAFE;
      reasons.push(
        `High wind speed ${hour.wind_kmh} km/h at ${hour.time}`
      );
    }
  }

  if (classification !== CLASSIFICATION.UNSAFE) {
    if (
      maxRain >= WEATHER_THRESHOLDS.MODERATE_RAIN ||
      maxWind >= WEATHER_THRESHOLDS.MODERATE_WIND
    ) {
      classification = CLASSIFICATION.RISKY;
      reasons.push("Moderate weather conditions detected");
    }
  }

  const severityScore = calculateSeverityScore(maxRain, maxWind);

  return {
    classification,
    severityScore,
    reasons,
  };
};