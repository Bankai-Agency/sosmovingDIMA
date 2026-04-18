"use client";

import { useRef, useEffect, type CSSProperties } from "react";
import { gsap } from "gsap";
import "./image-trail.css";

function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

type Point = { x: number; y: number };

function getLocalPointerPos(
  e: MouseEvent | TouchEvent,
  rect: DOMRect
): Point {
  let clientX = 0;
  let clientY = 0;
  if ("touches" in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if ("clientX" in e) {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  return { x: clientX - rect.left, y: clientY - rect.top };
}

function dist(p1: Point, p2: Point) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

class ImageItem {
  el: HTMLDivElement;
  inner: HTMLDivElement | null;
  rect: DOMRect;
  constructor(el: HTMLDivElement) {
    this.el = el;
    this.inner = el.querySelector(".content__img-inner");
    this.rect = el.getBoundingClientRect();
    window.addEventListener("resize", this.resize);
  }
  resize = () => {
    gsap.set(this.el, { scale: 1, x: 0, y: 0, opacity: 0 });
    this.rect = this.el.getBoundingClientRect();
  };
}

class Trail {
  container: HTMLDivElement;
  images: ImageItem[];
  total: number;
  pos = 0;
  zIndex = 1;
  active = 0;
  idle = true;
  threshold = 80;
  mouse: Point = { x: 0, y: 0 };
  last: Point = { x: 0, y: 0 };
  cache: Point = { x: 0, y: 0 };

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.images = Array.from(container.querySelectorAll<HTMLDivElement>(".content__img")).map(
      (el) => new ImageItem(el)
    );
    this.total = this.images.length;

    const onMove = (ev: MouseEvent | TouchEvent) => {
      this.mouse = getLocalPointerPos(ev, container.getBoundingClientRect());
    };
    container.addEventListener("mousemove", onMove);
    container.addEventListener("touchmove", onMove);

    const init = (ev: MouseEvent | TouchEvent) => {
      this.mouse = getLocalPointerPos(ev, container.getBoundingClientRect());
      this.cache = { ...this.mouse };
      requestAnimationFrame(this.render);
      container.removeEventListener("mousemove", init);
      container.removeEventListener("touchmove", init);
    };
    container.addEventListener("mousemove", init);
    container.addEventListener("touchmove", init);
  }

  render = () => {
    const d = dist(this.mouse, this.last);
    this.cache.x = lerp(this.cache.x, this.mouse.x, 0.1);
    this.cache.y = lerp(this.cache.y, this.mouse.y, 0.1);
    if (d > this.threshold) {
      this.show();
      this.last = { ...this.mouse };
    }
    if (this.idle && this.zIndex !== 1) this.zIndex = 1;
    requestAnimationFrame(this.render);
  };

  show() {
    this.zIndex++;
    this.pos = this.pos < this.total - 1 ? this.pos + 1 : 0;
    const img = this.images[this.pos];
    gsap.killTweensOf(img.el);
    gsap
      .timeline({
        onStart: () => {
          this.active++;
          this.idle = false;
        },
        onComplete: () => {
          this.active--;
          if (this.active === 0) this.idle = true;
        },
      })
      .fromTo(
        img.el,
        {
          opacity: 1,
          scale: 1,
          zIndex: this.zIndex,
          x: this.cache.x - img.rect.width / 2,
          y: this.cache.y - img.rect.height / 2,
        },
        {
          duration: 0.4,
          ease: "power1",
          x: this.mouse.x - img.rect.width / 2,
          y: this.mouse.y - img.rect.height / 2,
        },
        0
      )
      .to(
        img.el,
        { duration: 0.4, ease: "power3", opacity: 0, scale: 0.2 },
        0.4
      );
  }
}

type Props = {
  items?: string[];
  className?: string;
  style?: CSSProperties;
};

export default function ImageTrail({ items = [], className = "", style }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const t = new Trail(containerRef.current);
    return () => {
      // simple cleanup — keep it light, GC handles rest
      void t;
    };
  }, [items]);

  return (
    <div
      className={`image-trail-content ${className}`}
      ref={containerRef}
      style={style}
    >
      {items.map((url, i) => (
        <div className="content__img" key={i}>
          <div
            className="content__img-inner"
            style={{ backgroundImage: `url(${url})` }}
          />
        </div>
      ))}
    </div>
  );
}
