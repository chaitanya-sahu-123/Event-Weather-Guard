import dayjs from "dayjs";

export const filterForecastByWindow = (hourlyData, startTime, endTime) => {
  const { time, precipitation_probability, weathercode, windspeed_10m } =
    hourlyData;

  const filtered = [];

  for (let i = 0; i < time.length; i++) {
    const forecastTime = dayjs(time[i]);

    if (
      forecastTime.isAfter(dayjs(startTime)) ||
      forecastTime.isSame(dayjs(startTime))
    ) {
      if (
        forecastTime.isBefore(dayjs(endTime)) ||
        forecastTime.isSame(dayjs(endTime))
      ) {
        filtered.push({
          time: time[i],
          rain_prob: precipitation_probability[i],
          wind_kmh: windspeed_10m[i],
          weathercode: weathercode[i],
        });
      }
    }
  }

  return filtered;
};