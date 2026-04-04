import { z } from "zod";

export const generatePairingCodeResponseSchema = z.object({
  pairingCode: z.string(),
  expiresAt: z.string(),
});

export const pairDeviceBodySchema = z.object({
  pairingCode: z.string().min(4).max(12),
  deviceName: z.string().min(1).max(100),
  platform: z.string().max(100).optional(),
});

export const pairDeviceResponseSchema = z.object({
  device: z.object({
    id: z.string(),
    name: z.string(),
    platform: z.string().nullable().optional(),
    trusted: z.boolean(),
    pairedAt: z.string(),
    lastSeenAt: z.string(),
  }),
  token: z.string(),
});
