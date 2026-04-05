import { ApiError } from "exnexus";
import { runCommand } from "./handlers/command.handler.js";
import { runOpenUrl } from "./handlers/openUrl.handler.js";
import { runOpenApp } from "./handlers/openApp.handler.js";
import { runDelay } from "./handlers/delay.handler.js";
import { runSequence } from "./handlers/sequence.handler.js";
import { runBackgroundCommand } from "./handlers/commandBg.handler.js";

export const executeActionDefinition = async (action) => {
  if (!action?.enabled) {
    throw new ApiError(400, `Action is disabled: ${action?.id || "unknown"}`);
  }

  return executeStep({
    type: action.type,
    payload: action.payload,
  });
};

export const executeStep = async (step) => {
  switch (step.type) {
    case "command":
      return runCommand(step.payload);

    case "command_bg":
      return runBackgroundCommand(step.payload);

    case "open_url":
      return runOpenUrl(step.payload);

    case "open_app":
      return runOpenApp(step.payload);

    case "delay":
      return runDelay(step.payload);

    case "sequence":
      return runSequence(step.payload, executeStep);

    default:
      return {
        success: false,
        output: null,
        error: `Unsupported action type: ${step.type}`,
      };
  }
};
