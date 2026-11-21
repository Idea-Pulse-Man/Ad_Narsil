"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Same variants as the app's Toast so section code ports unchanged. */
export type ToastVariant = "default" | "link" | "error";
export type ShowToast = (message: string, variant?: ToastVariant) => void;

/** The app's Toast shape, for the ported sections' prop types. */
export interface ToastState {
  id: number;
  message: string;
  variant?: ToastVariant;
}

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

/** Toast queue: info toasts leave after 5 s, errors stay until closed (admin brief §7). */
export function useToasts(): { toasts: Toast[]; showToast: ShowToast; dismiss: (id: number) => void } {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    window.clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  const showToast = useCallback<ShowToast>(
    (message, variant = "default") => {
      const id = ++nextId.current;
      setToasts((list) => [...list.slice(-3), { id, message, variant }]);
      if (variant !== "error") timers.current.set(id, window.setTimeout(() => dismiss(id), 5000));
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  return { toasts, showToast, dismiss };
}

export function Toasts({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  const item = (t: Toast) => (
    <div
      key={t.id}
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-rail ${
        t.variant === "error"
          ? "border-red-400/30 bg-[#3a1717] text-red-100"
          : "border-white/12 bg-ink-soft text-canvas"
      }`}
    >
      <p className="min-w-0 flex-1">{t.message}</p>
      <button
        type="button"
        onClick={() => dismiss(t.id)}
        aria-label="Dismiss"
        className="-my-1 -mr-1 rounded px-1.5 text-base leading-none text-white/50 hover:text-white"
      >
        ×
      </button>
    </div>
  );

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 lg:left-auto lg:right-6 lg:bottom-6 lg:w-96">
      <div role="status" aria-live="polite" className="flex flex-col gap-2">
        {toasts.filter((t) => t.variant !== "error").map(item)}
      </div>
      <div role="alert" className="flex flex-col gap-2">
        {toasts.filter((t) => t.variant === "error").map(item)}
      </div>
    </div>
  );
}
