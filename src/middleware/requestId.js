import crypto from "node:crypto";

const HEADER_NAME = "x-request-id";

const requestId = (req, res, next) => {
  const incoming = req.get(HEADER_NAME);
  const id = incoming && incoming.trim() ? incoming.trim() : crypto.randomUUID();

  req.requestId = id;
  res.setHeader(HEADER_NAME, id);

  console.log(`Request ID - ${id}\nRequest Method - ${req.method}\nRequest API endpoint - ${req.originalUrl}`);
  next();
};

export default requestId;
