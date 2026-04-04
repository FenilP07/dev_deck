import http from "http";
import app from "./app.js";
import env from "./config/env.config.js";
import { initializeStorage } from "./services/storage/storageInit.service.js";
import { attachSocketServer } from "./services/socket/socket.server.js";

const startServer = async () => {
  try {
    await initializeStorage();
    const server = http.createServer(app);
    attachSocketServer(server);
    server.listen(env.PORT, env.HOST, () => {
      console.log(
        `${env.APP_NAME} running on http://${env.HOST}:${env.PORT} in ${env.NODE_ENV} mode`,
      );
      console.log(`Websocket server attached at ws://${env.HOST}:${env.PORT}/ws`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
