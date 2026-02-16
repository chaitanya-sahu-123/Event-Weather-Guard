export const calculateSeverityScore = (maxRain, maxWind) => {
  const windNormalized = Math.min((maxWind / 50) * 100, 100);

  const score = maxRain * 0.6 + windNormalized * 0.4;

  return Math.min(Math.round(score), 100);
};