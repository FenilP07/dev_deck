import { asyncHandler } from "exnexus";
import { listProcesses, getProcessDetails,stopProcess } from "./process.service.js";

export const getProcessesController = asyncHandler(async (req, res) => {
  const processes = await listProcesses();

  return res.success(processes, "Processes retrieved successfully");
});

export const getProcessesByIdController = asyncHandler(async (req, res) => {
  const processInfo = await getProcessDetails(req.params.processId);
  return res.success(processInfo, "Process details retrieved successfully");
});

export const stopProcessController = asyncHandler(async (req, res) => {
  const processInfo = await stopProcess(req.params.processId);

  return res.success(processInfo, "Process stopped successfully");
});
