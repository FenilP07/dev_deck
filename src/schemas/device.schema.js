import { z } from "zod";

export const deviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  platform: z.string().nullable().optional(),
  token: z.string(),
  trusted: z.boolean(),
  pairedAt: z.string(),
  lastSeenAt: z.string(),
});

export const deviceListSchema = z.array(deviceSchema);
