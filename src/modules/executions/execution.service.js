import { jsonDb } from "../../services/storage/jsonDb.service.js";
import paths from "../../config/paths.config.js";

import {
  executionListSchema,
  triggerExecutionBodySchema,
} from "../../schemas/execution.schems.js";
import { errors } from "exnexus";
import { getActionById } from "../actions/action.service.js";
import { executeActionDefinition } from "../../services/executor/executor.service.js";
import { nanoid } from "nanoid";
import {
  emitExecutionFinished,
  emitExecutionStarted,
  emitProcessStopped
} from "../../services/socket/socket.events.js";

export const getAllExecutions = async () => {
  const rawExecutions = await jsonDb.read(paths.executions, []);

  const parsed = executionListSchema.safeParse(rawExecutions);

  if (!parsed.success) {
    throw errors.internal("Invalid execution data format");
  }

  return parsed.data;
};

export const getExecutionById = async (executionId) => {
  const executions = await getAllExecutions();

  const execution = executions.find((item) => item.id === executionId);

  if (!execution) {
    throw errors.notFound(`Execution not found: ${executionId}`);
  }
  return execution;
};

export const createExecutionRecord = async ({
  actionId,
  actionName,
  deviceId,
}) => {
  const executions = await getAllExecutions();

  const record = {
    id: nanoid(),
    actionId,
    actionName,
    deviceId,
    status: "running",
    startedAt: new Date().toISOString(),
    endedAt: null,
    output: null,
    error: null,
    meta: null,
  };

  executions.unshift(record);
  await jsonDb.write(paths.executions, executions);
  return record;
};

export const finalizeExecutionRecord = async ({ executionId, updates }) => {
  const executions = await getAllExecutions();
  const index = executions.findIndex((item) => item.id === executionId);

  if (index === -1) {
    throw errors.notFound(`Execution not found: ${executionId}`);
  }

  executions[index] = {
    ...executions[index],
    ...updates,
  };
  await jsonDb.write(paths.executions, executions);
  return executions[index];
};

export const triggerExecution = async ({ actionId, device }) => {
  const bodyParsed = triggerExecutionBodySchema.safeParse({ actionId });

  if (!bodyParsed.success) {
    throw errors.badRequest(
      "Invalid execution request",
      bodyParsed.error.flatten(),
    );
  }

  const action = await getActionById(bodyParsed.data.actionId);

  const execution = await createExecutionRecord({
    actionId: action.id,
    actionName: action.name,
    deviceId: device.id,
  });
  emitExecutionStarted(device.id, execution);

  const result = await executeActionDefinition(action, {
    deviceId: device.id,
  });

  const finalized = await finalizeExecutionRecord({
    executionId: execution.id,
    updates: {
      status: result.success ? "success" : "failed",
      endedAt: new Date().toISOString(),
      output: result.output || null,
      error: result.error || null,
      meta: result.meta || null,
    },
  });

  emitExecutionFinished(device.id, finalized);

  return finalized;
};
