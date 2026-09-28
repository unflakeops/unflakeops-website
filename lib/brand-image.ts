import { readFileSync } from "node:fs";
import { join } from "node:path";

const symbol = readFileSync(join(process.cwd(), "public", "unflakeops-symbol.png"));

export const brandSymbolDataUrl = `data:image/png;base64,${symbol.toString("base64")}`;
