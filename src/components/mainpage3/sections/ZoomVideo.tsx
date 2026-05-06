"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Osmo Supply "Image to Background (Zoom)" — 1:1 port to React.
 *
 * Source: https://osmo.supply/  (Image to Background Zoom)
 * Adapted for SOS Moving: dark palette, brand video instead of placeholder image,
 * Switzer typography, mainpage3 token system.
 *
 * The Osmo `data-bg-zoom-*` attributes and DOM structure are preserved
 * exactly so their published GSAP/Flip/ScrollTrigger logic works unmodified.
 */
export function ZoomVideo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger, Flip);

    const root = containerRef.current;
    if (!root) return;
    const containers = root.querySelectorAll<HTMLElement>("[data-bg-zoom-init]");
    if (!containers.length) return;

    // Force-start the brand-reel video and keep it playing.
    // autoPlay attribute is not always honoured; we explicitly .play() and
    // also resume whenever the video drifts back into the viewport or is
    // paused by a browser heuristic.
    const video = root.querySelector<HTMLVideoElement>("[data-bg-zoom-img]");
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      const tryPlay = () => video.play().catch(() => {});

      if (video.readyState >= 2) tryPlay();
      else video.addEventListener("loadeddata", tryPlay, { once: true });

      // Resume on first user interaction (in case autoplay policy blocks it).
      const onInteract = () => tryPlay();
      window.addEventListener("scroll", onInteract, { passive: true });
      window.addEventListener("pointerdown", onInteract);

      // IntersectionObserver: keep playing while visible.
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && video.paused) tryPlay();
          });
        },
        { threshold: 0.01 },
      );
      io.observe(video);

      // Resume if the browser pauses (e.g. tab heuristic) while still visible.
      video.addEventListener("pause", () => {
        if (document.visibilityState === "visible") {
          // small delay to avoid fighting an intentional pause from devtools
          setTimeout(() => tryPlay(), 50);
        }
      });
    }

    let masterTimeline: gsap.core.Timeline | null = null;

    const getScrollRange = ({
      trigger,
      start,
      endTrigger,
      end,
    }: {
      trigger: HTMLElement;
      start: string;
      endTrigger: HTMLElement;
      end: string;
    }) => {
      const st = ScrollTrigger.create({ trigger, start, endTrigger, end });
      const range = Math.max(1, st.end - st.start);
      st.kill();
      return range;
    };

    const bgZoomTimeline = () => {
      if (masterTimeline) masterTimeline.kill();

      const startTrigger =
        containers[0].querySelector<HTMLElement>("[data-bg-zoom-start]") ||
        containers[0];

      masterTimeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: startTrigger,
          start: "clamp(top bottom)",
          endTrigger: containers[containers.length - 1],
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      containers.forEach((container) => {
        const startEl = container.querySelector<HTMLElement>("[data-bg-zoom-start]");
        const endEl = container.querySelector<HTMLElement>("[data-bg-zoom-end]");
        const contentEl = container.querySelector<HTMLElement>("[data-bg-zoom-content]");
        const darkEl = container.querySelector<HTMLElement>("[data-bg-zoom-dark]");
        const imgEl = container.querySelector<HTMLElement>("[data-bg-zoom-img]");
        if (!startEl || !endEl || !contentEl) return;

        const startRadius = getComputedStyle(startEl).borderRadius;
        const endRadius = getComputedStyle(endEl).borderRadius;
        const hasRadius = startRadius !== "0px" || endRadius !== "0px";
        contentEl.style.overflow = hasRadius ? "hidden" : "";
        if (hasRadius) gsap.set(contentEl, { borderRadius: startRadius });

        Flip.fit(contentEl, startEl, { scale: false });

        const zoomScrollRange = getScrollRange({
          trigger: startEl,
          start: "clamp(top bottom)",
          endTrigger: endEl,
          end: "center center",
        });

        const afterScrollRange = getScrollRange({
          trigger: endEl,
          start: "center center",
          endTrigger: container,
          end: "bottom top",
        });

        masterTimeline!.add(
          Flip.fit(contentEl, endEl, {
            duration: zoomScrollRange,
            ease: "none",
            scale: false,
          }) as gsap.core.Tween,
        );

        if (hasRadius) {
          masterTimeline!.to(
            contentEl,
            { borderRadius: endRadius, duration: zoomScrollRange },
            "<",
          );
        }

        masterTimeline!.to(contentEl, {
          y: `+=${afterScrollRange}`,
          duration: afterScrollRange,
        });

        if (darkEl) {
          gsap.set(darkEl, { opacity: 0 });
          masterTimeline!.to(
            darkEl,
            { opacity: 0.75, duration: afterScrollRange * 0.25 },
            "<",
          );
        }

        if (imgEl) {
          gsap.set(imgEl, { scale: 1, transformOrigin: "50% 50%" });
          masterTimeline!.to(
            imgEl,
            { scale: 1.25, yPercent: -10, duration: afterScrollRange },
            "<",
          );
        }
      });

      ScrollTrigger.refresh();
    };

    bgZoomTimeline();

    // Belt-and-suspenders: also fire .play() via ScrollTrigger so playback
    // is forced inside the same animation frame Lenis is driving. window
    // 'scroll' may not bubble through Lenis on every browser/setup.
    if (video) {
      ScrollTrigger.create({
        trigger: containers[0],
        start: "top bottom",
        end: "bottom top",
        onEnter: () => video.play().catch(() => {}),
        onEnterBack: () => video.play().catch(() => {}),
        onUpdate: () => {
          if (video.paused) video.play().catch(() => {});
        },
      });
    }

    // ===== Per-word scroll-scrubbed reveal for H1 + 3 H2s =====
    // Splits each heading into <span class="m3-reveal-word"><span class="m3-reveal-inner">word</span></span>,
    // animates opacity + yPercent tied to scrollProgress so reverse scroll undoes the reveal.
    // Preserves the inner .background-zoom__h1-span (accent yellow) by walking text nodes only.
    const headings = Array.from(
      root.querySelectorAll<HTMLElement>(".background-zoom__h"),
    );
    const originalHTML: string[] = [];
    const revealTriggers: ScrollTrigger[] = [];

    const splitTextNodes = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        if (!text.trim()) return;
        const frag = document.createDocumentFragment();
        text.split(/(\s+)/).forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) {
            frag.appendChild(document.createTextNode(p));
          } else {
            const word = document.createElement("span");
            word.className = "m3-reveal-word";
            const inner = document.createElement("span");
            inner.className = "m3-reveal-inner";
            inner.textContent = p;
            word.appendChild(inner);
            frag.appendChild(word);
          }
        });
        node.parentNode?.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(splitTextNodes);
      }
    };

    headings.forEach((h, i) => {
      if (h.dataset.split === "true") return;
      originalHTML[i] = h.innerHTML;
      h.dataset.split = "true";
      splitTextNodes(h);
      const inners = h.querySelectorAll<HTMLElement>(".m3-reveal-inner");
      if (!inners.length) return;
      gsap.set(inners, { yPercent: 110, opacity: 0 });
      const tween = gsap.to(inners, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.04,
        ease: "none",
        scrollTrigger: {
          trigger: h,
          start: "top 88%",
          end: "top 35%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      if (tween.scrollTrigger) revealTriggers.push(tween.scrollTrigger);
    });

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(bgZoomTimeline, 100);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      if (masterTimeline) masterTimeline.kill();
      revealTriggers.forEach((t) => t.kill());
      headings.forEach((h, i) => {
        if (originalHTML[i] !== undefined) {
          h.innerHTML = originalHTML[i];
          delete h.dataset.split;
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef}>
      <section data-bg-zoom-init="" className="background-zoom">
        <div className="background-zoom__title">
          <h1 className="background-zoom__h">
            Watch SOS Moving in motion — every move,
            <span className="background-zoom__h1-span"> from gate to door</span>,
            on tape and on time.
          </h1>
        </div>
        <div data-bg-zoom-start="" className="background-zoom__start">
          <div
            data-bg-zoom-content=""
            className="background-zoom__content"
            onClick={() => {
              const v = containerRef.current?.querySelector<HTMLVideoElement>(
                "[data-bg-zoom-img]",
              );
              if (v) {
                if (v.paused) v.play().catch(() => {});
                else v.pause();
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <video
              data-bg-zoom-img=""
              className="background-zoom__img"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              disableRemotePlayback
            >
              {/* webm first — same source the live /mainpage2 hero uses, known to autoplay */}
              <source src="/mainpage2/videos/SOS-video-transcode.webm" type="video/webm" />
              <source src="/mainpage2/videos/SOS-video-transcode.mp4"  type="video/mp4" />
            </video>
            <p className="background-zoom__pod">SOS · REEL</p>
            <div data-bg-zoom-dark="" className="background-zoom__dark"></div>
          </div>
        </div>
        <div data-bg-zoom-end="" className="background-zoom__end"></div>
        <div className="background-zoom__text">
          <h2 className="background-zoom__h">
            10,000+ moves choreographed by the{" "}
            <span className="background-zoom__h1-span">same trained crew</span>{" "}
            — every truck, every day, every neighborhood across LA.
          </h2>
          <h2 className="background-zoom__h is--margin-top">
            No callbacks at midnight. No surprise fees on the final bill. No
            hidden hours.{" "}
            <span className="background-zoom__h1-span">Just the rate you were quoted</span>{" "}
            and the truck you were promised, on the dot.
          </h2>
          <h2 className="background-zoom__h is--margin-top">
            Background-checked, uniformed, equipped with our own padded
            blankets, shrink wrap and dollies — your home in{" "}
            <span className="background-zoom__h1-span">trusted hands</span>{" "}
            from your old door to your new one.
          </h2>
        </div>
      </section>
    </div>
  );
}
