import { spawn } from "child_process";

export const runOpenApp = async (payload = {}) => {
  const target = payload.target;
  const args = Array.isArray(payload.args) ? payload.args : [];
  const cwd = payload.cwd || process.cwd();

  return new Promise((resolve) => {
    try {
      const child = spawn(target, args, {
        cwd,
        detached: true,
        stdio: "ignore",
        shell: process.platform === "win32",
      });

      child.unref();

      resolve({
        success: true,
        output: `Opend app: ${target}`,
        error: null,
      });
    } catch (error) {
      resolve({
        success: false,
        output: null,
        error: `Failed to open app: ${error.message}`,
      });
    }
  });
};
