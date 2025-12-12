import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import {
  getAllServices,
  newService,
  getServiceById,
  updateService,
  deleteService,
} from "../controller/servicesController";

const Servicerouter = Router();

Servicerouter.get("/", authenticate, getAllServices);
Servicerouter.get("/:id", authenticate, getServiceById);
Servicerouter.put("/:id", authenticate, updateService);
Servicerouter.delete("/:id", authenticate, deleteService);
Servicerouter.post("/registro", authenticate, newService);

export default Servicerouter;
