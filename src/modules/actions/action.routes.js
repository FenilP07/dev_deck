import { Router } from "express";
import {
  getActionByIdController,
  getActionsController,
} from "./action.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getActionsController);
router.get("/:actionId", requireAuth, getActionByIdController);

export default router;
