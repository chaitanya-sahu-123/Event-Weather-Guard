export const calculateSeverityScore = (maxRain, maxWind) => {
  const rainWeight = 0.65;
  const windWeight = 0.35;

  const normalizedWind = Math.min((maxWind / 60) * 100, 100);

  const score =
    maxRain * rainWeight +
    normalizedWind * windWeight;

  return Math.round(Math.min(score, 100));
};