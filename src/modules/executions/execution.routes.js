import { Router } from "express";
import {
  getExecutionByIdController,
  getExecutionsController,
  triggerExecutionController,
} from "./execution.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, triggerExecutionController);
router.get("/", requireAuth, getExecutionsController);
router.get("/:executionId", requireAuth, getExecutionByIdController);

export default router;
