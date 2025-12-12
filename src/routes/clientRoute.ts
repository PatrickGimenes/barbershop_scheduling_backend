import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { login } from "../controller/authController";
import {
  gelAllClients,
  newClient,
  deleteClient,
  getClientById,
  updateClient,
} from "../controller/clientController";

const router = Router();

router.get("/", authenticate, gelAllClients);
router.get("/:id", authenticate, getClientById);
router.post("/login", login);
router.post("/registro", newClient);
router.delete("/:id", authenticate, deleteClient);
router.put("/:id", authenticate, updateClient);

export default router;
