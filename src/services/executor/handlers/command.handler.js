import { exec } from "child_process";

export const runCommand = async (payload = {}) => {
    
  const command = payload.command;
  const cwd = payload.cwd || process.cwd();
  const shell = typeof payload.shell === "boolean" ? payload.shell : true;
  const timeout = payload.timeoutMs || 60000;

  return new Promise((resolve) => {
    exec(
      command,
      {
        cwd,
        shell,
        timeout,
      },
      (error, stdout, stderr) => {
        if (error) {
          resolve({
            success: false,
            output: stdout?.trim() || null,
            error: stderr?.trim() || error.message,
          });
          return;
        }
        resolve({
          success: true,
          output: stdout?.trim() || `Command executed:${command}`,
          error: null,
        });
      },
    );
  });
};
