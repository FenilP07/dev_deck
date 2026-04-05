import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import {
  getProcessesController,
  getProcessesByIdController,
  stopProcessController,
} from "./process.controller.js";

const router = Router();

router.get("/", requireAuth, getProcessesController);
router.get("/:processId", requireAuth, getProcessesByIdController);
router.post("/:processId/stop", requireAuth, stopProcessController);

export default router;
