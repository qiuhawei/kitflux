"use client";

import type { KeyboardEvent } from "react";

/** Cmd/Ctrl + Enter triggers an action inside textareas/inputs. */
export function onModEnter(
  event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  action: () => void,
) {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    event.preventDefault();
    action();
  }
}
