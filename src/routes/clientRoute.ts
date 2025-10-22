import { Router } from "express";
import { gelAllClients, newClient } from "../controller/clientController";

const router = Router();

router.get('/', gelAllClients);
router.post('/', newClient)

export default router;