const runningProcesses = new Map();

export const registerProcess = (processInfo) => {
  runningProcesses.set(processInfo.id, processInfo);
  return processInfo;
};

export const getAllProcesses = () => {
  return Array.from(runningProcesses.values());
};

export const getProcessById = (processId) => {
  return runningProcesses.get(processId) || null;
};

export const updateProcess = (processId, updates) => {
  const existing = runningProcesses.get(processId);
  if (!existing) return null;

  const next = {
    ...existing,
    ...updates,
  };

  runningProcesses.set(processId, next);
  return next;
};

export const removeProcess = (processId) => {
  return runningProcesses.delete(processId);
};
