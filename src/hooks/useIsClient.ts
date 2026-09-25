"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** True only on the client — avoids SSR/client hydration mismatches. */
export function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}
