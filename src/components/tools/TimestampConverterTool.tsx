"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { ToolStatus } from "@/components/ToolStatus";
import { useIsClient } from "@/hooks/useIsClient";

function normalizeEpoch(value: number) {
  return Math.abs(value) >= 1e12 ? value : value * 1000;
}

export function TimestampConverterTool() {
  const isClient = useIsClient();
  const [epochInput, setEpochInput] = useState("1700000000");
  const [dateInput, setDateInput] = useState("2023-11-14T22:13:20");

  const fromEpoch = useMemo(() => {
    if (!epochInput.trim()) return null;
    const raw = Number(epochInput);
    if (!Number.isFinite(raw)) return null;
    const date = new Date(normalizeEpoch(raw));
    if (Number.isNaN(date.getTime())) return null;
    return {
      local: date.toString(),
      utc: date.toUTCString(),
      iso: date.toISOString(),
    };
  }, [epochInput]);

  const fromDate = useMemo(() => {
    if (!dateInput.trim()) return null;
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return null;
    return {
      seconds: Math.floor(date.getTime() / 1000),
      millis: date.getTime(),
    };
  }, [dateInput]);

  function useNow() {
    if (!isClient) return;
    const now = Date.now();
    setEpochInput(String(Math.floor(now / 1000)));
    setDateInput(new Date(now).toISOString().slice(0, 19));
  }

  return (
    <div className="tool-panel">
      <div className="tool-actions">
        <button type="button" className="btn btn-primary" onClick={useNow} disabled={!isClient}>
          Use now
        </button>
      </div>
      <div className="split-editors">
        <div className="stack">
          <label className="field">
            <span>Unix timestamp</span>
            <input
              value={epochInput}
              onChange={(e) => setEpochInput(e.target.value)}
              inputMode="numeric"
            />
          </label>
          {fromEpoch ? (
            <div className="result-box">
              <p>
                <strong>Local:</strong> {fromEpoch.local}
              </p>
              <p>
                <strong>UTC:</strong> {fromEpoch.utc}
              </p>
              <p>
                <strong>ISO:</strong> {fromEpoch.iso}
              </p>
              <div className="tool-actions">
                <CopyButton value={fromEpoch.iso} label="Copy ISO" />
                <CopyButton value={fromEpoch.utc} label="Copy UTC" />
              </div>
            </div>
          ) : (
            <ToolStatus error={epochInput ? "Enter a valid timestamp." : undefined} />
          )}
        </div>

        <div className="stack">
          <label className="field">
            <span>Date / time</span>
            <input
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              placeholder="2026-09-25T06:00:00"
            />
          </label>
          {fromDate ? (
            <div className="result-box">
              <p>
                <strong>Seconds:</strong> {fromDate.seconds}
              </p>
              <p>
                <strong>Milliseconds:</strong> {fromDate.millis}
              </p>
              <div className="tool-actions">
                <CopyButton value={String(fromDate.seconds)} label="Copy seconds" />
                <CopyButton value={String(fromDate.millis)} label="Copy ms" />
              </div>
            </div>
          ) : (
            <ToolStatus error={dateInput ? "Enter a valid date string." : undefined} />
          )}
        </div>
      </div>
    </div>
  );
}
