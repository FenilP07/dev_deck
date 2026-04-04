import { WebSocketServer } from "ws";
import { getDeviceByToken, touchDeviceLastSeen } from "../../modules/devices/device.service.js";
import { addSocketClient, removeSocketClient } from "./socket.registery.js";

const extractTokenFromUrl = (requestUrl = "") => {
  try {
    const url = new URL(requestUrl, "http://localhost");
    return url.searchParams.get("token");
  } catch {
    return null;
  }
};

export const attachSocketServer = (server) => {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
  });

  wss.on("connection", async (ws, req) => {
    try {
      const token = extractTokenFromUrl(req.url);

      if (!token) {
        ws.close(4001, "Missing token");
        return;
      }

      const device = await getDeviceByToken(token);

      if (!device) {
        ws.close(4002, "Unauthorized");
        return;
      }

      const updatedDevice = await touchDeviceLastSeen(device.id);
      const deviceId = updatedDevice.id;

      addSocketClient(deviceId, ws);

      ws.send(
        JSON.stringify({
          event: "socket:connected",
          data: {
            deviceId,
            deviceName: updatedDevice.name,
          },
          timestamp: new Date().toISOString(),
        })
      );

      ws.on("close", () => {
        removeSocketClient(deviceId, ws);
      });

      ws.on("error", () => {
        removeSocketClient(deviceId, ws);
      });
    } catch {
      ws.close(1011, "Socket initialization failed");
    }
  });

  return wss;
};