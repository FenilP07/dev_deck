import fs from "fs/promises";

class JsonDbService {
  async ensureFile(filePath, fallbackData = null) {
    try {
      await fs.access(filePath);
    } catch {
      const initialData = fallbackData ?? [];
      await fs.writeFile(
        filePath,
        JSON.stringify(initialData, null, 2),
        "utf-8",
      );
    }
  }

  async read(filePath, fallbackData = null) {
    await this.ensureFile(filePath, fallbackData);

    const raw = await fs.readFile(filePath, "utf-8");

    if (!raw.trim()) {
      return fallbackData ?? [];
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      throw new Error(`Invalid JSON in file: ${filePath}`);
    }
  }

  async write(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }

  async update(filePath, updater, fallbackData = null) {
    const current = await this.read(filePath, fallbackData);
    const next = await updater(current);
    await this.write(filePath, next);
    return next;
  }
}

export const jsonDb = new JsonDbService();
export default jsonDb;
