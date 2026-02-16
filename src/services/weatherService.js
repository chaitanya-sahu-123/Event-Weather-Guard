import axios from "axios";


export const fetchHourlyForecast = async (latitude, longitude) => {
  try {
    const url = "https://api.open-meteo.com/v1/forecast";

    const response = await axios.get(url, {
      params: {
        latitude,
        longitude,
        hourly: "precipitation_probability,weathercode,windspeed_10m",
        timezone: "auto",
      },
    });

    return response.data.hourly;
  } catch (error) {
    throw new Error("Failed to fetch weather data");
  }
};