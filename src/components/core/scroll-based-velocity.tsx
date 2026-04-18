"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import {
  Children,
  useRef,
  type ReactNode,
  type HTMLAttributes,
} from "react";

/** Wrap a number within [min, max), useful for infinite marquee positioning. */
function wrap(min: number, max: number, v: number): number {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/** Typography wrapper — holds one or more ScrollVelocityRow instances. */
export function ScrollVelocityContainer({
  children,
  className = "",
  ...rest
}: ContainerProps) {
  return (
    <div
      className={`relative w-full flex flex-col items-stretch ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

type RowProps = {
  children: ReactNode;
  className?: string;
  /** constant idle scroll in % per second */
  baseVelocity?: number;
  /** 1 moves left-to-right, -1 right-to-left */
  direction?: 1 | -1;
  /** how many times to repeat the children inline to avoid seams */
  repeat?: number;
};

export function ScrollVelocityRow({
  children,
  className = "",
  baseVelocity = 5,
  direction = 1,
  repeat = 6,
}: RowProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 80,
    stiffness: 200,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);
  const directionRef = useRef(direction);

  useAnimationFrame((_, delta) => {
    let moveBy = directionRef.current * baseVelocity * (delta / 1000);
    const vel = scrollVelocity.get();
    if (vel < 0) directionRef.current = (-direction) as 1 | -1;
    else if (vel > 0) directionRef.current = direction;
    moveBy += directionRef.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const childArr = Children.toArray(children);

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className={`inline-flex items-center whitespace-nowrap ${className}`}
        style={{ x }}
      >
        {Array.from({ length: repeat }).map((_, i) => (
          <span key={i} className="flex items-center mr-[0.5em]">
            {childArr}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
