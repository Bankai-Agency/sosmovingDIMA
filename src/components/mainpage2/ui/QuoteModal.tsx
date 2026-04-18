"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { QuoteFormFields } from "@/components/mainpage2/ui/QuoteFormFields";

const OPEN_EVENT = "sos:open-quote-modal";

/** Dispatches a global "open quote modal" event. Mount <QuoteModal /> once per app. */
export function openQuoteModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(OPEN_EVENT));
  }
}

export function QuoteModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm grid place-items-center p-4 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-modal-title"
            className="relative w-full max-w-2xl my-auto rounded-[2rem] bg-surface border border-white/10 p-6 sm:p-8 md:p-10 text-white"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 grid place-items-center w-10 h-10 rounded-full bg-white/[0.06] text-white hover:bg-white/15 transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex flex-col gap-1 mb-6 pr-10">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-muted">
                Free estimate
              </p>
              <h2
                id="quote-modal-title"
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[0.95] tracking-[-0.04em]"
              >
                Leave a request
              </h2>
            </div>

            <QuoteFormFields />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
