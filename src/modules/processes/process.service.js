import { errors } from "exnexus";
import {
  getAllProcesses,
  getProcessById,
  updateProcess,
} from "../../services/process/process.manager.js";

export const listProcesses = async () => {
  return getAllProcesses();
};

export const getProcessDetails = async (processId) => {
  const processInfo = getProcessById(processId);

  if (!processInfo) {
    throw errors.notFound(`Process with ID ${processId} not found`);
  }
  return processInfo;
};

export const stopProcess = async (processId) => {
  const processInfo = getProcessById(processId);

  if (!processInfo) {
    throw errors.notFound(`Process with ID ${processId} not found`);
  }

  if (!processInfo.pid || processInfo.status !== "running") {
    throw errors.badRequest(`Process with ID ${processId} is not running`);
  }
  try {
    process.kill(processInfo.pid);

    const updated = updateProcess(processId, {
      status: "stopped",
      endedAt: new Date().toISOString(),
      signal: "SIGTERM",
    });
    return updated;
  } catch (error) {
    throw errors.internalServerError(
      `Failed to stop process with ID ${processId}`,
    );
  }
};
