import { Router } from "express";
import { messageHandler } from "../controllers/whatsapp.controller.js";

const router = Router();

router.route('/whatsapp-greet').post(messageHandler);

export default router;