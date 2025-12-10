import express from "express";
import cors from "cors";
import clientRoutes from "./routes/clientRoute";
import Servicerouter from "./routes/serviceRoute";

import cookieParser from "cookie-parser";

const app = express();

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.get("/ping", (_, res) => res.send("pong"));

app.use("/clientes", clientRoutes);
app.use("/servico", Servicerouter);

export default app;
