import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
export const STATIC_PATH = resolve(currentDirectory, "..", "..", "..", "client");