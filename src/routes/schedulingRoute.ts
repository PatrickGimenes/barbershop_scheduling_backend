import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import {
  deleteScheduling,
  getAllScheduling,
  getSchedulingById,
  newScheduling,
  updateScheduling,
} from "../controller/schedulingController";

const Schedulingrouter = Router();

Schedulingrouter.get("/", authenticate, getAllScheduling);
Schedulingrouter.get("/:id", authenticate, getSchedulingById);
Schedulingrouter.put("/:id", authenticate, updateScheduling);
Schedulingrouter.delete("/:id", authenticate, deleteScheduling);
Schedulingrouter.post("/cadastro", authenticate, newScheduling);

export default Schedulingrouter;
