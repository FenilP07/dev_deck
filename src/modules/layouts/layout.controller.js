import { ApiResponse, asyncHandler } from "exnexus";
import {
  getAllLayouts,
  getDefaultLayout,
  getLayoutById,
} from "./layout.service.js";

export const getLayoutsController = asyncHandler(async (req, res) => {
  const layouts = await getAllLayouts();

  return res
    .status(200)
    .json(new ApiResponse(200, "Layouts fetched successfully", layouts));
});

export const getLayoutByIdController = asyncHandler(async (req, res) => {
  const layout = await getLayoutById(req.params.layoutId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Layout fetched successfully", layout));
});

export const getDefaultLayoutController = asyncHandler(async (req, res) => {
  const layout = await getDefaultLayout();

  return res
    .status(200)
    .json(new ApiResponse(200, "Default layout fetched successfully", layout));
});
