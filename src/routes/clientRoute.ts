import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { login } from "../controller/authController";
import {
  gelAllClients,
  newClient,
  scheduling,
} from "../controller/clientController";

const router = Router();

router.get("/", gelAllClients);
router.post("/login", login);
router.get("/agendamentos", authenticate, scheduling);
router.post("/registro", newClient);

export default router;
