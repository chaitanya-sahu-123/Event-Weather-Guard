import express from "express";
import cors from "cors";
import eventRoutes from "./routes/eventRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", eventRoutes);

export default app;
