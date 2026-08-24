import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { extname } from "node:path";

const forbiddenPaths = [
  /(^|\/)data\//i,
  /(^|\/)runtime\//i,
  /(^|\/)tools\//i,
  /(^|\/)release\//i,
  /\.realm$/i,
  /\.(db|sqlite|sqlite3|log)$/i,
  /service-account/i,
  /firebase-admin/i,
];
const textExtensions = new Set([".md", ".json", ".yml", ".yaml", ".ts", ".tsx", ".js", ".mjs", ".txt"]);
const sensitiveContent = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /AIza[0-9A-Za-z_-]{30,}/,
  /(?:token|password|secret)\s*[:=]\s*["'][^"']{12,}["']/i,
  /[A-Z]:\\Users\\[^\\]+\\/i,
];

const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean);
const violations = [];

for (const file of files) {
  if (!existsSync(file)) continue;
  if (forbiddenPaths.some((pattern) => pattern.test(file))) violations.push(`caminho proibido: ${file}`);
  if (!textExtensions.has(extname(file).toLowerCase())) continue;
  const content = readFileSync(file, "utf8");
  if (sensitiveContent.some((pattern) => pattern.test(content))) violations.push(`conteúdo sensível potencial: ${file}`);
}

if (violations.length) {
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log(`${files.length} arquivos rastreados validados para o escopo público.`);
