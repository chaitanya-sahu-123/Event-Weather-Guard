import axios from "axios";


export const fetchHourlyForecast = async (latitude, longitude) => {
  try {
    console.time("weatherFetch");
    const url = "https://api.open-meteo.com/v1/forecast";

    const response = await axios.get(url, {
      params: {
        latitude,
        longitude,
        hourly: ["precipitation_probability","weathercode","windspeed_10m"],
        timezone: "auto",
      },
    });

    console.timeEnd("weatherFetch");

    return response.data.hourly;
  } catch (error) {
    console.error("Weather API Error:", error.message);
    throw new Error("Failed to fetch weather data");
  }
};