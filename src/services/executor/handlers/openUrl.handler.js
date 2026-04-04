import { exec } from "child_process";
import { success } from "zod";

const getOpenCommand = (url) => {
  switch (process.platform) {
    case "win32":
      return `start "" "${url}"`;
    case "darwin":
      return `open "${url}"`;
    default:
      return `xdg-open "${url}"`;
  }
};

export const runOpenUrl = async (payload = {}) => {
  const url = payload.url;

  return new Promise((resolve) => {
    exec(getOpenCommand(url), (error) => {
      if (error) {
        resolve({
          success: false,
          output: null,
          error: error.message,
        });
        return;
      }
      resolve({
        success: true,
        output: `Opened URL: ${url}`,
        error: null,
      });
    });
  });
};
