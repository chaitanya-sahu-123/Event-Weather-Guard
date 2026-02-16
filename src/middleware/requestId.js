import crypto from "node:crypto";

const HEADER_NAME = "x-request-id";

const requestId = (req, res, next) => {
  const startMs = Date.now();
  const incoming = req.get(HEADER_NAME);
  const id = incoming && incoming.trim() ? incoming.trim() : crypto.randomUUID();

  req.requestId = id;
  res.setHeader(HEADER_NAME, id);

  console.log(
    `Request ID - ${id}\nRequest Method - ${req.method}\nRequest API endpoint - ${req.originalUrl}`
  );

  res.on("finish", () => {
    const durationMs = Date.now() - startMs;
    console.log(
      `Response Status Code - ${res.statusCode}\nDuration - ${durationMs}ms`
    );
  });

  next();
};

export default requestId;
