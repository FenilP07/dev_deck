import { Router } from "express";
import { getSettingsController } from "./settings.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getSettingsController);

export default router;
