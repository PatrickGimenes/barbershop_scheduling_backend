import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { getAllServices, newService } from "../controller/servicesController";

const Servicerouter = Router();


Servicerouter.get("/", authenticate, getAllServices);
Servicerouter.post("/registro", authenticate, newService);

export default Servicerouter;