import { ApiError } from "exnexus";
import paths from "../../config/paths.config.js";
import { deviceListSchema } from "../../schemas/device.schema.js";
import jsonDb from "../../services/storage/jsonDb.service.js";

export const getAllDevices = async () => {
  const rawDevices = await jsonDb.read(paths.devices, []);

  const parsed = deviceListSchema.safeParse(rawDevices);

  if (!parsed.success) {
    throw new ApiError(
      500,
      "Invalid devices configuration",
      parsed.error.flatten(),
    );
  }

  return parsed.data;
};

export const getDeviceByToken = async (token) => {
  const devices = await getAllDevices();
  return devices.find((device) => device.token === token && device.trusted);
};

export const getDeviceById = async (deviceId) => {
  const devices = await getAllDevices();
  return devices.find((device) => device.id === deviceId);
};

export const upsertDevice = async (incomingDevice) => {
  const devices = await getAllDevices();
  const existingIndex = devices.findIndex(
    (device) => device.id === incomingDevice.id,
  );

  if (existingIndex >= 0) {
    devices[existingIndex] = incomingDevice;
  } else {
    devices.push(incomingDevice);
  }

  await jsonDb.write(paths.devices, devices);

  return incomingDevice;
};

export const touchDeviceLastSeen = async (deviceId) => {
  const devices = await getAllDevices();
  const idx = devices.findIndex((device) => device.id === deviceId);

  if (idx === -1) {
    throw new ApiError(404, `Device not found: ${deviceId}`);
  }

  devices[idx] = {
    ...devices[idx],
    lastSeenAt: new Date().toISOString(),
  };

  await jsonDb.write(paths.devices, devices);
  return devices[idx];
};
