"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  thumbnail: string;
  className?: string;
}

/**
 * Facade YouTube player — shows a thumbnail with play button,
 * loads the iframe only on click. Supports expand to fullscreen modal.
 */
export function YouTubePlayer({
  videoId,
  title,
  thumbnail,
  className = "",
}: YouTubePlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const play = useCallback(() => setPlaying(true), []);

  const toggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  // Escape to close expanded
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [expanded]);

  // Lock scroll when expanded
  useEffect(() => {
    document.body.style.overflow = expanded ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [expanded]);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&controls=1`;

  const playerContent = (
    <motion.div
      layoutId={`yt-${videoId}`}
      className={
        expanded
          ? "relative w-[90vw] max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
          : `relative w-full aspect-video rounded-2xl overflow-hidden ${className}`
      }
    >
      {!playing ? (
        <>
          {/* Thumbnail */}
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 85vw, 740px"
          />
          <div className="absolute inset-0 bg-black/30 transition-colors duration-300 hover:bg-black/40" />

          {/* Play button */}
          <button
            type="button"
            onClick={play}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
            aria-label={`Play ${title}`}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="white"
              className="ml-1 group-hover:scale-110 transition-transform"
              aria-hidden="true"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>

          {/* Title */}
          <h3 className="absolute bottom-4 left-5 right-14 sm:bottom-6 sm:left-7 z-10 text-base sm:text-lg md:text-xl font-semibold text-white leading-snug">
            {title}
          </h3>
        </>
      ) : (
        /* YouTube iframe */
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      )}

      {/* Expand / minimize button */}
      {playing && (
        <button
          type="button"
          onClick={toggleExpand}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all"
          aria-label={expanded ? "Minimize" : "Expand"}
        >
          {expanded ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
            </svg>
          )}
        </button>
      )}
    </motion.div>
  );

  return (
    <>
      {/* Inline player */}
      {!expanded && playerContent}

      {/* Expanded modal */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setExpanded(false)}
            />
            {/* Player */}
            <div className="relative z-10">{playerContent}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
