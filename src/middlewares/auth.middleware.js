import { errors } from "exnexus";
import {
  getDeviceByToken,
  touchDeviceLastSeen,
} from "../modules/devices/device.service.js";

const extractBearerToken = (authHeader = "") => {
  if (!authHeader || typeof authHeader !== "string") return null;

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) return null;

  return token.trim();
};

export const requireAuth = async (req, res, next) => {
  try {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
      throw new errors.unauthorized("Auhorization token is missing.");
    }

    const device = await getDeviceByToken(token);

    if (!device) {
      throw new errors.unauthorized("Invalid authentication token.");
    }

    const updatedDevice = await touchDeviceLastSeen(device.id);
    req.device = updatedDevice;

    next();
  } catch (error) {
    next(error);
  }
};
