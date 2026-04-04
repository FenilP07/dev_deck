const clientsByDeviceId = new Map();

export const addSocketClient = (deviceId, ws) => {
  if (!clientsByDeviceId.has(deviceId)) {
    clientsByDeviceId.set(deviceId, new Set());
  }

  clientsByDeviceId.get(deviceId).add(ws);
};

export const removeSocketClient = (deviceId, ws) => {
  const set = clientsByDeviceId.get(deviceId);
  if (!set) return;

  set.delete(ws);

  if (set.size === 0) {
    clientsByDeviceId.delete(deviceId);
  }
};

export const getSocketClients = (deviceId) => {
  return clientsByDeviceId.get(deviceId) || new Set();
};
