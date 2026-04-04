import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcRoot = path.resolve(__dirname, "..");
const dataDir = path.join(srcRoot, "data");

export const paths = {
  srcRoot,
  dataDir,
  settings: path.join(dataDir, "settings.json"),
  devices: path.join(dataDir, "devices.json"),
  actions: path.join(dataDir, "actions.json"),
  layouts: path.join(dataDir, "layouts.json"),
  executions: path.join(dataDir, "executions.json"),
};

export default paths;