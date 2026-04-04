import paths from "../../config/paths.config.js";
import jsonDb from "../../services/storage/jsonDb.service.js";
import { layoutListSchema } from "../../schemas/layout.schema.js";
import { ApiError } from "exnexus";

export const getAllLayouts = async () => {
  const rawLayouts = await jsonDb.read(paths.layouts, []);

  const parsed = layoutListSchema.safeParse(rawLayouts);

  if (!parsed.success) {
    throw new ApiError(
      500,
      "Invalid layouts configuration",
      parsed.error.flatten(),
    );
  }

  return parsed.data;
};

export const getLayoutById = async (layoutId) => {
  const layouts = await getAllLayouts();
  const layout = layouts.find((item) => item.id === layoutId);

  if (!layout) {
    throw new ApiError(404, `layout not found:${layoutId}`);
  }

  return layout;
};

export const getDefaultLayout = async () => {
  const layouts = await getAllLayouts();
  const layout = layouts.find((item) => item.isDefault);

  if (!layout) {
    throw new ApiError(404, "No default layout configured");
  }

  return layout;
};
