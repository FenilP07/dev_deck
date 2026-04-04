import { ApiResponse, asyncHandler } from "exnexus";
import { getSettings } from "./settings.service.js";

export const getSettingsController = asyncHandler(async (req, res) => {
  const settings = await getSettings();

  return res
    .status(200)
    .json(new ApiResponse(200, "Settings fetched successfully", settings));
});
