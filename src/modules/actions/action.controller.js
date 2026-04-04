import { ApiResponse, asyncHandler } from "exnexus";
import { getActionById, getAllActions } from "./action.service.js";

export const getActionsController = asyncHandler(async (req, res) => {
  const actions = await getAllActions();

  return res
    .status(200)
    .json(new ApiResponse(200, "Actions fetched succesfullt", actions));
});

export const getActionByIdController = asyncHandler(async (req, res) => {
  const action = await getActionById(req.params.actionId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Action fetched succesfully", action));
});
