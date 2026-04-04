import { Router } from "express";
import {
  generatePairingCodeController,
  getMeController,
  pairDeviceController,
} from "./auth.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/pairing-code", generatePairingCodeController);
router.post("/pair", pairDeviceController);
router.get("/me", requireAuth, getMeController);

export default router;
