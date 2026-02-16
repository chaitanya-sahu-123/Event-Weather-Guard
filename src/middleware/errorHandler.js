const errorHandler = (err, req, res, next) => {
  const requestId = req?.requestId;
  console.error(requestId ? `[${requestId}] Unhandled Error:` : "Unhandled Error:", err);

  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
    requestId,
  });
}

export default errorHandler;