import { spawn } from "child_process";
import { nanoid } from "nanoid";
import {
  registerProcess,
  updateProcess,
} from "../../process/process.manager.js";
import {
  emitProcessStarted,
  emitProcessLog,
  emitProcessUpdated,
  emitProcessStopped,
} from "../../socket/socket.events.js";

export const runBackgroundCommand = async (payload = {}, context = {}) => {
  const command = payload.command;
  const cwd = payload.cwd || process.cwd();
  const shell = typeof payload.shell === "boolean" ? payload.shell : true;
  const env = payload.env || {};
  const name = payload.name || command;
  const deviceId = context.deviceId || null;

  return new Promise((resolve) => {
    try {
      const child = spawn(command, [], {
        cwd,
        shell,
        env: {
          ...process.env,
          ...env,
        },
        detached: false,
      });

      const processId = nanoid();
      let stdoutBuffer = "";
      let stderrBuffer = "";

      const processInfo = registerProcess({
        id: processId,
        deviceId,
        name,
        command,
        cwd,
        pid: child.pid ?? null,
        status: "running",
        startedAt: new Date().toISOString(),
        endedAt: null,
        exitCode: null,
        signal: null,
        stdout: "",
        stderr: "",
      });

      // 🔥 emit started
      if (deviceId) {
        emitProcessStarted(deviceId, processInfo);
      }

      child.stdout?.on("data", (chunk) => {
        const text = chunk.toString();
        stdoutBuffer += text;

        const updated = updateProcess(processId, { stdout: stdoutBuffer });

        if (deviceId) {
          emitProcessLog(deviceId, {
            processId,
            type: "stdout",
            chunk: text,
          });

          emitProcessUpdated(deviceId, updated);
        }
      });

      child.stderr?.on("data", (chunk) => {
        const text = chunk.toString();
        stderrBuffer += text;

        const updated = updateProcess(processId, { stderr: stderrBuffer });

        if (deviceId) {
          emitProcessLog(deviceId, {
            processId,
            type: "stderr",
            chunk: text,
          });

          emitProcessUpdated(deviceId, updated);
        }
      });

      child.on("close", (code, signal) => {
        const updated = updateProcess(processId, {
          status: code === 0 ? "exited" : "failed",
          endedAt: new Date().toISOString(),
          exitCode: code,
          signal: signal || null,
          stdout: stdoutBuffer,
          stderr: stderrBuffer,
        });

        if (deviceId) {
          emitProcessStopped(deviceId, updated);
        }
      });

      child.on("error", (error) => {
        const updated = updateProcess(processId, {
          status: "failed",
          endedAt: new Date().toISOString(),
          stderr: error.message,
        });

        if (deviceId) {
          emitProcessStopped(deviceId, updated);
        }
      });

      resolve({
        success: true,
        output: `Started background process: ${name}`,
        error: null,
        meta: {
          processId: processInfo.id,
          pid: processInfo.pid,
          name: processInfo.name,
        },
      });
    } catch (error) {
      resolve({
        success: false,
        output: null,
        error: error.message,
      });
    }
  });
};
