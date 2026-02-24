"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right";
  delay?: number;
}

export default function ScrollAnimation({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const animations = {
    "fade-up": {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(30px)",
    },
    "fade-in": {
      opacity: isVisible ? 1 : 0,
    },
    "slide-left": {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateX(0)" : "translateX(30px)",
    },
    "slide-right": {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateX(0)" : "translateX(-30px)",
    },
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...animations[animation],
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
