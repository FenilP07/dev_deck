import { z } from "zod";

export const executionStatusEnum = z.enum(["running", "success", "failed"]);

export const executionSchema = z.object({
  id: z.string(),
  actionId: z.string(),
  actionName: z.string(),
  deviceId: z.string(),
  status: executionStatusEnum,
  startedAt: z.string(),
  endedAt: z.string().nullable(),
  output: z.string().nullable(),
  error: z.string().nullable(),
  meta: z.record(z.string(), z.any()).nullable().optional(),
});

export const executionListSchema = z.array(executionSchema);

export const triggerExecutionBodySchema = z.object({
  actionId: z.string().min(1),
});
