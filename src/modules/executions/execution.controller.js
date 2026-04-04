import { asyncHandler } from "exnexus";
import { getAllExecutions, triggerExecution } from "./execution.service.js";
import { getActionById } from "../actions/action.service.js";

export const triggerExecutionController = asyncHandler(async (req, res) => {
  const execution = await triggerExecution({
    actionId: req.body.actionId,
    device: req.device,
  });

  return res.success(execution, "Execution triggered successfully");
});

export const getExecutionsController = asyncHandler(async (req, res) => {
  const executions = await getAllExecutions();

  return res.success(executions, "Executions fetched successfully");
});

export const getExecutionByIdController = asyncHandler(async (req, res) => {
  const execution = await getActionById(req.params.executionId);

  return res.success(execution, "Execution fetched successfully");
});
