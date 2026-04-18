"use client";

import { useState, useRef } from "react";

type Props = {
  src: string;
  poster?: string;
  title: string;
  className?: string;
};

export function VideoReviewPlayer({ src, poster, title, className = "" }: Props) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    void v.play();
    setPlaying(true);
  };

  return (
    <div
      data-video-card={playing ? "playing" : "idle"}
      onClick={play}
      role="button"
      tabIndex={0}
      aria-label={`Play ${title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          play();
        }
      }}
      className={`relative w-full h-full overflow-hidden bg-black ${
        !playing ? "cursor-none" : ""
      } ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        controls={playing}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      {!playing && (
        <>
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/25 pointer-events-none"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="white"
              aria-hidden="true"
              className="ml-[1px]"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </span>
          <h3 className="absolute bottom-4 left-5 right-5 sm:bottom-6 sm:left-7 text-base sm:text-lg md:text-xl font-semibold text-white leading-snug pointer-events-none">
            {title}
          </h3>
        </>
      )}
    </div>
  );
}
