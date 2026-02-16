import express from "express";
import cors from "cors";
import eventRoutes from "./routes/eventRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import requestId from "./middleware/requestId.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestId);

app.use("/", eventRoutes);

app.use(errorHandler);

export default app;
