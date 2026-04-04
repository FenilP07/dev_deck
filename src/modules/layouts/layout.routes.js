import { Router } from "express";
import {
  getDefaultLayoutController,
  getLayoutByIdController,
  getLayoutsController,
} from "./layout.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getLayoutsController);
router.get("/default/current", requireAuth, getDefaultLayoutController);
router.get("/:layoutId", requireAuth, getLayoutByIdController);

export default router;
