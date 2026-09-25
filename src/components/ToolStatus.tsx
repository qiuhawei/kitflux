"use client";

type ToolStatusProps = {
  error?: string;
  info?: string;
};

export function ToolStatus({ error, info }: ToolStatusProps) {
  if (!error && !info) return null;

  return (
    <p
      className={error ? "tool-error" : "tool-info"}
      role={error ? "alert" : "status"}
      aria-live="polite"
    >
      {error || info}
    </p>
  );
}
