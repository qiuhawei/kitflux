/** Lightweight JSON → YAML for browser tools (no dependency). */

function needsQuotes(value: string) {
  return (
    value === "" ||
    value === "true" ||
    value === "false" ||
    value === "null" ||
    /[:#\n\r\t"'\[\]{}&*!|>%@`]/.test(value) ||
    value.trim() !== value ||
    /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(value)
  );
}

export function toYaml(value: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);

  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("JSON numbers must be finite");
    return String(value);
  }
  if (typeof value === "string") {
    return needsQuotes(value) ? JSON.stringify(value) : value;
  }

  if (Array.isArray(value)) {
    if (!value.length) return "[]";
    return value
      .map((item) => {
        if (item && typeof item === "object") {
          const nested = toYaml(item, indent + 1);
          const lines = nested.split("\n");
          return `${pad}- ${lines[0]}\n${lines
            .slice(1)
            .map((line) => `${pad}  ${line}`)
            .join("\n")}`.replace(/\n+$/, "");
        }
        return `${pad}- ${toYaml(item, 0)}`;
      })
      .join("\n");
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (!entries.length) return "{}";
    return entries
      .map(([key, child]) => {
        const safeKey = needsQuotes(key) ? JSON.stringify(key) : key;
        if (child && typeof child === "object") {
          const nested = toYaml(child, indent + 1);
          if (
            (Array.isArray(child) && child.length === 0) ||
            (!Array.isArray(child) && Object.keys(child as object).length === 0)
          ) {
            return `${pad}${safeKey}: ${nested}`;
          }
          return `${pad}${safeKey}:\n${nested}`;
        }
        return `${pad}${safeKey}: ${toYaml(child, 0)}`;
      })
      .join("\n");
  }

  throw new Error(`Unsupported JSON value: ${typeof value}`);
}
