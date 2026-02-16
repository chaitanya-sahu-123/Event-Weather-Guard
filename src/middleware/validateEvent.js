import Joi from "joi";

const MAX_EVENT_DURATION_MS = 72 * 60 * 60 * 1000; // 72 hours

const eventSchema = Joi.object({
  name: Joi.string().trim().min(3).max(120).required(),

  location: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
  }).required(),

  start_time: Joi.date().iso().required(),
  end_time: Joi.date().iso().required(),
}).required();

function validateEvent(req, res, next) {
  const { error, value } = eventSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      error: "Invalid request body",
      details: error.details.map((d) => d.message),
      requestId: req.requestId,
    });
  }

  if (!value) {
    return res.status(400).json({
      error: "Invalid request body",
      message: "Request body is required",
      requestId: req.requestId,
    });
  }

  const start = new Date(value.start_time);
  const end = new Date(value.end_time);

  if (start >= end) {
    return res.status(400).json({
      error: "Invalid time window",
      message: "start_time must be earlier than end_time",
      requestId: req.requestId,
    });
  }

  if (end - start > MAX_EVENT_DURATION_MS) {
    return res.status(400).json({
      error: "Event duration too long",
      message: "Maximum event duration is 72 hours",
      requestId: req.requestId,
    });
  }

  req.body = value;
  next();
}

export default validateEvent;
