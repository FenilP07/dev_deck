import { spawn } from "child_process";
import { nanoid } from "nanoid";
import {
  registerProcess,
  updateProcess,
} from "../../process/process.manager.js";

export const runBackgroundCommand = async (payload = {}) => {
  const command = payload.command;
  const cwd = payload.cwd || process.cwd();
  const shell = typeof payload.shell === "boolean" ? payload.shell : true;
  const env = payload.env || {};
  const name = payload.name || command;

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

      child.stdout?.on("data", (chunk) => {
        stdoutBuffer += chunk.toString();
        updateProcess(processId, { stdout: stdoutBuffer });
      });

      child.stderr?.on("data", (chunk) => {
        stderrBuffer += chunk.toString();
        updateProcess(processId, { stderr: stderrBuffer });
      });

      child.on("close", (code, signal) => {
        updateProcess(processId, {
          status: code === 0 ? "exited" : "failed",
          endedAt: new Date().toISOString(),
          exitCode: code,
          signal: signal || null,
          stdout: stdoutBuffer,
          stderr: stderrBuffer,
        });
      });
      child.on("error", (error) => {
        updateProcess(processId, {
          status: "failed",
          endedAt: new Date().toISOString(),
          exitCode: null,
          signal: null,
          stderr: error.message,
        });
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
