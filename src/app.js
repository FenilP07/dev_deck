import express from "express";
import cors from "cors";
import healthRoutes from "./modules/health/health.route.js";
import settingsRoutes from "./modules/settings/settings.routes.js";
import actionRoutes from "./modules/actions/action.routes.js";
import layoutRoutes from "./modules/layouts/layout.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import executionRoutes from "./modules/executions/execution.routes.js";
import processRoutes from "./modules/processes/process.route.js";

import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorHandler, requestLogger, responseEnhancer } from "exnexus";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(responseEnhancer);

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/actions", actionRoutes);
app.use("/api/layouts", layoutRoutes);
app.use("/api/executions", executionRoutes);
app.use("/api/processes", processRoutes);

app.use(notFoundMiddleware);
app.use(errorHandler);

export default app;
