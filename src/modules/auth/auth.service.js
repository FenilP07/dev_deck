import crypto from "crypto";
import { nanoid } from "nanoid";
import { ApiError } from "exnexus";
import paths from "../../config/paths.config.js";
import jsonDb from "../../services/storage/jsonDb.service.js";
import { getSettings } from "../settings/settings.service.js";
import { upsertDevice } from "../devices/device.service.js";

const PAIRING_CODE_TTL_MINUTES = 10;

const generateNumericCode = (length = 6) => {
  let code = "";
  for (let i = 0; i < length; i += 1) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
};

const generateDeviceToken = () => crypto.randomBytes(32).toString("hex");

export const createPairingCode = async () => {
  const settings = await getSettings();
  const pairingCode = generateNumericCode(6);

  const expiresAt = new Date(
    Date.now() + PAIRING_CODE_TTL_MINUTES * 60 * 1000,
  ).toISOString();

  const nextSettings = {
    ...settings,
    pairingCode,
    pairingCodeExpiresAt: expiresAt,
    updatedAt: new Date().toISOString(),
  };

  await jsonDb.write(paths.settings, nextSettings);

  return {
    pairingCode,
    expiresAt,
  };
};

export const pairDevice = async ({ pairingCode, deviceName, platform }) => {
  const settings = await getSettings();

  if (!settings.pairingCode || !settings.pairingCodeExpiresAt) {
    throw new ApiError(400, "No active pairing code. Generate one first.");
  }

  const expiresAtMs = new Date(settings.pairingCodeExpiresAt).getTime();

  if (Number.isNaN(expiresAtMs) || Date.now() > expiresAtMs) {
    throw new ApiError(400, "Pairing code has expired. Generate a new one.");
  }

  if (String(pairingCode).trim() !== String(settings.pairingCode).trim()) {
    throw new ApiError(401, "Invalid pairing code.");
  }

  const now = new Date().toISOString();

  const device = {
    id: nanoid(),
    name: deviceName.trim(),
    platform: platform?.trim() || null,
    token: generateDeviceToken(),
    trusted: true,
    pairedAt: now,
    lastSeenAt: now,
  };

  await upsertDevice(device);

  const nextSettings = {
    ...settings,
    pairingCode: null,
    pairingCodeExpiresAt: null,
    updatedAt: now,
  };

  await jsonDb.write(paths.settings, nextSettings);

  return {
    device: {
      id: device.id,
      name: device.name,
      platform: device.platform,
      trusted: device.trusted,
      pairedAt: device.pairedAt,
      lastSeenAt: device.lastSeenAt,
    },
    token: device.token,
  };
};

export const getAuthContext = async (device) => {
  return {
    device: {
      id: device.id,
      name: device.name,
      platform: device.platform || null,
      trusted: device.trusted,
      pairedAt: device.pairedAt,
      lastSeenAt: device.lastSeenAt,
    },
  };
};
