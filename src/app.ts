import express from "express";
import cors from "cors";
import clientRoutes from "./routes/clientRoute";

import cookieParser from "cookie-parser";

const app = express();

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.get("/ping", (_, res) => res.send("pong"));

app.use("/clientes", clientRoutes);

export default app;
