import { z } from "zod";

const actionTypeEnum = z.enum([
  "command",
  "command_bg",
  "open_url",
  "open_app",
  "delay",
  "sequence",
]);

const commandPayloadSchema = z.object({
  command: z.string(),
  cwd: z.string().optional(),
  shell: z.boolean().optional(),
  timeoutMs: z.number().int().positive().optional(),
});

const commandBgPayloadSchema = z.object({
  command: z.string(),
  cwd: z.string().optional(),
  shell: z.boolean().optional(),
  env: z.record(z.string()).optional(),
  name: z.string().optional(),
});

const openUrlPayloadSchema = z.object({
  url: z.string().url(),
});

const openAppPayloadSchema = z.object({
  target: z.string(),
  args: z.array(z.string()).optional(),
  cwd: z.string().optional(),
});

const delayPayloadSchema = z.object({
  ms: z.number().int().nonnegative(),
});

export const actionStepSchema = z.lazy(() =>
  z.object({
    type: actionTypeEnum,
    label: z.string().optional(),
    payload: z.any(),
  }),
);

const sequencePayloadSchema = z.object({
  steps: z.array(actionStepSchema).min(1),
  stopOnFailure: z.boolean().optional(),
});

export const actionSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: actionTypeEnum,
  enabled: z.boolean(),
  payload: z.union([
    commandPayloadSchema,
    commandBgPayloadSchema,
    openUrlPayloadSchema,
    openAppPayloadSchema,
    delayPayloadSchema,
    sequencePayloadSchema,
  ]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const actionListSchema = z.array(actionSchema);
