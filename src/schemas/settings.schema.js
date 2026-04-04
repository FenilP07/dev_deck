import { z } from "zod";

export const settingsSchema = z.object({
  appName: z.string(),
  version: z.string(),
  machineName: z.string(),
  pairingCode: z.string().nullable(),
  pairingCodeExpiresAt: z.string().nullable(),
  allowLocalNetworkOnly: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
