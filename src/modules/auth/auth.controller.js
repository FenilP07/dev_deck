import { asyncHandler, errors } from "exnexus";
import {
  createPairingCode,
  getAuthContext,
  pairDevice,
} from "./auth.service.js";
import {
  generatePairingCodeResponseSchema,
  pairDeviceBodySchema,
  pairDeviceResponseSchema,
} from "../../schemas/auth.schemas.js";

export const generatePairingCodeController = asyncHandler(async (req, res) => {
  const result = await createPairingCode();

  const parsed = generatePairingCodeResponseSchema.safeParse(result);
  if (!parsed.success) {
    throw errors.internal(
      "Invalid pairing code response",
      parsed.error.flatten(),
    );
  }
  return res.success(parsed.data, "Pairing code generated successfully");
});

export const pairDeviceController = asyncHandler(async (req, res) => {
  const bodyParsed = pairDeviceBodySchema.safeParse(req.body);

  if (!bodyParsed.success) {
    throw errors.badRequest(
      "Invalid  pairing request ",
      bodyParsed.error.flatten(),
    );
  }

  const result = await pairDevice(bodyParsed.data);

  const responseParsed = pairDeviceResponseSchema.safeParse(result);

  if (!responseParsed.success) {
    throw errors.internal(
      "Invalid pair device response",
      responseParsed.error.flatten(),
    );
  }
  return res.success(responseParsed.data, "Device paired successfully");
});

export const getMeController = asyncHandler(async (req, res) => {
  const result = await getAuthContext(req.device);

  return res.success(result, "Authenticated device fetched successfully");
});
