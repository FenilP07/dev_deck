import jsonDb from "../../services/storage/jsonDb.service.js";
import paths from "../../config/paths.config.js";
import { settingsSchema } from "../../schemas/settings.schema.js";
import { ApiError } from "exnexus";

export const getSettings = async () => {
  const rawSettings = await jsonDb.read(paths.settings, {});

  const parsed = settingsSchema.safeParse(rawSettings);

  if (!parsed.success) {
    throw new ApiError(
      500,
      "Invalid settings configuration",
      parsed.error.flatten(),
    );
  }

  return parsed.data;
};
