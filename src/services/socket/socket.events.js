import { getSocketClients } from "./socket.registery.js";

const safeSend = (ws, payload) => {
  if (ws.readyState === 1) {
    ws.send(JSON.stringify(payload));
  }
};

export const emitToDevice = (deviiceId, event, data) => {
  const clients = getSocketClients(deviiceId);

  for (const ws of clients) {
    safeSend(ws, {
      event,
      data,
      timeStamp: new Date().toISOString(),
    });
  }
};

export const emitExecutionStarted = (deviceId, execution) => {
  emitToDevice(deviceId, "executionStarted", execution);
};

export const emitExecutionFinished = (deviceId, execution) => {
  emitToDevice(deviceId, "executionFinished", execution);
};

export const emitProcessStarted = (deviceId, process) => {
  emitToDevice(deviceId, "process:started", process);
};

export const emitProcessLog = (deviceId, payload) => {
  emitToDevice(deviceId, "process:log", payload);
};

export const emitProcessUpdated = (deviceId, process) => {
  emitToDevice(deviceId, "process:updated", process);
};

export const emitProcessStopped = (deviceId, process) => {
  emitToDevice(deviceId, "process:stopped", process);
};
