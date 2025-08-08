// files.ts
// File naming + mime helpers + icon mapping.

import { generateId } from "./id";

export function safeFileName(originalName: string) {
  const ext = originalName.split(".").pop() ?? "bin";
  const base = originalName.replace(/\.[^/.]+$/, "");
  const slug = base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${slug}-${generateId("f")}.${ext}`;
}

export function fileIconFor(mime: string) {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime === "application/pdf") return "pdf";
  if (mime.includes("zip")) return "archive";
  if (mime.includes("json")) return "json";
  if (mime.includes("spreadsheet") || mime.includes("excel")) return "sheet";
  if (mime.includes("msword") || mime.includes("wordprocessingml")) return "doc";
  return "file";
}
