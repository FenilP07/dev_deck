import paths from "../../config/paths.config.js";
import jsonDb from "../../services/storage/jsonDb.service.js";
import {actionListSchema} from "../../schemas/action.schema.js";
import { ApiError } from "exnexus";

export const getAllActions = async () => {
  const rawActions = await jsonDb.read(paths.actions, []);
  const parsed = actionListSchema.safeParse(rawActions);
  if (!parsed.success) {
    throw new ApiError(
      500,
      "Invalid actions coniguration",
      parsed.error.flatten(),
    );
  }
  return parsed.data;
};

export const getActionById = async (actionId) => {
  const actions = await getAllActions();
  const action = actions.find((item) => item.id === actionId);
  if (!action) {
    throw new ApiError(404, `Action not found: ${actionId}`);
  }

  return action;
};
