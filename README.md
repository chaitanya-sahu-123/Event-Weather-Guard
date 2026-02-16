# 🌦 Event Weather Guard

**Will It Rain During My Event?**

Event Weather Guard is a backend service that evaluates weather conditions for outdoor events and determines whether the event is **Safe**, **Risky**, or **Unsafe** based on forecast data.

---

## What This Service Does

Given:

- Event name
- Location (latitude & longitude)
- Start time
- End time

The service:

1. Fetches hourly weather forecast data
2. Filters the forecast within the event time window
3. Applies deterministic classification rules
4. Returns:
   - Weather classification (Safe / Risky / Unsafe)
   - Severity score (0–100)
   - Clear explanation of why that decision was made
   - Hourly forecast during the event window

No database is used. No authentication is required. The focus is purely on weather analysis and decision logic.

---

## 🛠 Tech Stack

- Node.js
- Express.js
- Axios
- DayJS
- Open-Meteo API
- express-rate-limit (rate limiting)

---

## Rate Limiting

This API includes a rate limiter to reduce abuse and protect the upstream Open-Meteo API.

- Applied to: `POST /event-forecast`
- Policy: **100 requests per IP address per 15 minutes**
- When exceeded: returns **HTTP 429** with:

### Advantages

- Protects the service from accidental or abusive traffic spikes
- Helps prevent your Open-Meteo usage from being overwhelmed
- Improves stability and response times under load

---

# Event Weather Risk Forecast API

A simple, deterministic weather-risk classification API for outdoor
events.

Given an event name, coordinates, and time window, this service fetches
hourly weather data and classifies the event as:

-   ✅ **Safe**
-   ⚠️ **Risky**
-   ❌ **Unsafe**

It also returns a **severity score (0--100)** and a clear explanation of
*why* the event received that classification.

------------------------------------------------------------------------

## Steps to implement

### 1. Install dependencies express,axios,dayjs,cors,dotenv,joi, express-rate-limit

``` bash
npm install
```

### 2. Add .env file 
Add a .env file and put PORT=5000 or any port number free and available on your localhost


### 3. Start the server

Development mode:

``` bash
npm start
```


The server runs on:

    http://localhost:PORT_NUMBER

------------------------------------------------------------------------

## Run with Docker

1. Build docker image - docker build -t event-forecast-api .
2. Run the container - docker run -p 5000:5000 event-forecast-api
   
The API runs at http://localhost:5000

------------------------------------------------------------------------

## API Endpoint

### POST

    http://localhost:PORT_NUMBER/event-forecast

------------------------------------------------------------------------

## Sample Request

Send the following JSON as **raw body**:

``` json
{
  "name": "Concert on 19 February",
  "location": {
    "latitude": 18.9582,
    "longitude": 72.8321
  },
  "start_time": "2026-02-19T19:00:00",
  "end_time": "2026-02-19T22:00:00"
}
```

Example using curl:

``` bash
curl -X POST http://localhost:5000/event-forecast \
  -H "Content-Type: application/json" \
  -d '{
  "name": "Concert on 19 February",
  "location": {
    "latitude": 18.9582,
    "longitude": 72.8321
  },
  "start_time": "2026-02-19T19:00:00",
  "end_time": "2026-02-19T22:00:00"
}'
```

------------------------------------------------------------------------

## Response Structure

Example response:

``` json
{
  "event": "Concert on 19 February",
  "classification": "Risky",
  "severity_score": 68,
  "summary": "Risky weather conditions expected",
  "reason": [
    "Moderate weather conditions detected"
  ],
  "event_window_forecast": [
    {
      "time": "2026-02-19T20:00",
      "rain_prob": 70,
      "wind_kmh": 28,
      "weathercode": 3
    }
  ]
}
```

------------------------------------------------------------------------

## Weather Classification Rules

This application uses deterministic, clearly defined rules.

### ❌ Unsafe

An event is marked Unsafe if ANY of the following occur during the event
window:

-   Thunderstorm forecast (weather codes: 95, 96, 99) (OR)
-   Rain probability ≥ 80% (OR)
-   Wind speed ≥ 40 km/h

If even one hour crosses these thresholds, the entire event is
classified as Unsafe.

------------------------------------------------------------------------

### ⚠️ Risky

If no Unsafe condition is met, but:

-   Rain probability is between 60--79% (OR)
-   Wind speed is between 25--39 km/h

The event is marked as Risky.

------------------------------------------------------------------------

### ✅ Safe

If none of the above conditions are met, the event is classified as
Safe.

------------------------------------------------------------------------

## Severity Score (0-100)

Severity is calculated using:

    severity = (maxRain * 0.6) + (normalizedWind * 0.4)

Where:

    normalizedWind = min((maxWind / 50) * 100, 100)

### Interpretation

-   0-30 → Low impact\
-   31-60 → Moderate concern\
-   61-100 → High risk

The score provides a numerical understanding of weather severity.

------------------------------------------------------------------------

## Time Window Handling

-   Hourly forecast data is fetched.

-   Only hours within:

    `start_time <= forecast_time <= end_time`

    are analyzed.

-   If the event falls outside the available forecast range, a 400 error
    is returned.

-   If any single hour is unsafe, the entire event is treated as unsafe.

------------------------------------------------------------------------

## Weather API Used

This project uses the Open-Meteo API.

Data used:

-   precipitation_probability\
-   weathercode\
-   windspeed_10m

------------------------------------------------------------------------

## Explainability

Every response includes a `reason` field explaining:

-   Which rule was triggered\
-   At what time\
-   What value crossed the threshold

Everything is transparent here. There are no BlackBox decisions taken by the application.

------------------------------------------------------------------------

## Error Handling

Proper HTTP status codes are returned:

-   400 → Missing required fields\
-   400 → Event outside forecast range\
-   429 → Too many requests (rate limit exceeded)\
-   500 → Weather API failure

------------------------------------------------------------------------

## Project Structure

    src/
      routes/
      controllers/
      services/
      utils/
      config/
      app.js

    server.js

Architecture overview:

-   Routes → define endpoints\
-   Controllers → manage request flow\
-   Services → business logic\
-   Utils → calculations and helpers

------------------------------------------------------------------------

## Assumptions

-   Hourly granularity is sufficient\
-   If any hour is unsafe → entire event is unsafe\
-   Sustained wind speed is considered (not sudden high/low speed winds)\
-   No caching is implemented (live API call per request is made)
