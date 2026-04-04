import os from "os";
import { ApiResponse, asyncHandler } from "exnexus";
import env from "../../config/env.config.js";
import { getSettings } from "../settings/settings.service.js";

export const getHealth = asyncHandler(async (req, res) => {
  const settings = await getSettings();
  const data = {
    appName: env.APP_NAME,
    version: env.APP_VERSION,
    environment: env.NODE_ENV,
    uptimeSecdonds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    machineName: settings.machineName || os.hostname(),
    platform: process.platform,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, "deck agent is healthy", data));
});
