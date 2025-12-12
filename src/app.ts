import express from "express";
import cors from "cors";
import clientRoutes from "./routes/clientRoute";
import Servicerouter from "./routes/serviceRoute";
import  Schedulingrouter from "./routes/schedulingRoute";

import cookieParser from "cookie-parser";

const app = express();

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.get("/ping", (_, res) => res.send("pong"));

app.use("/cliente", clientRoutes);
app.use("/servico", Servicerouter);
app.use("/agendamento", Schedulingrouter)

export default app;
