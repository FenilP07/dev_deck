const runningProcesses = new Map();

export const registerProcess = (processInfo) => {
  const enriched = {
    ...processInfo,
    deviceId: processInfo.deviceId || null,
  };
  runningProcesses.set(enriched.id, enriched);
  return enriched;
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
