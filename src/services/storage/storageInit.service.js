import os from "os";
import paths from "../../config/paths.config.js";
import jsonDb from "./jsonDb.service.js";

export const initializeStorage = async () => {
  await jsonDb.ensureFile(paths.devices, []);
  await jsonDb.ensureFile(paths.actions, []);
  await jsonDb.ensureFile(paths.layouts, []);
  await jsonDb.ensureFile(paths.executions, []);

  const settings = await jsonDb.read(paths.settings, {});

  const now = new Date().toISOString();

  const nextSettings = {
    appName: settings.appName || "Deck Agent",
    version: settings.version || "1.0.0",
    machineName: settings.machineName || os.hostname(),
    pairingCode: settings.pairingCode ?? null,
    pairingCodeExpiresAt: settings.pairingCodeExpiresAt ?? null,
    allowLocalNetworkOnly:
      typeof settings.allowLocalNetworkOnly === "boolean"
        ? settings.allowLocalNetworkOnly
        : true,
    createdAt: settings.createdAt || now,
    updatedAt: now,
  };

  await jsonDb.write(paths.settings, nextSettings);
};