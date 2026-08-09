import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';

interface HeroParallaxLayersProps {
  children: React.ReactNode;
  className?: string;
}

interface HeroParallaxLayerProps {
  children: React.ReactNode;
  speed?: number; // Speed multiplier for relative layer parallax (e.g. 0.2, 0.5, 1.0)
  className?: string;
  rotateXOffset?: number;
}

export function HeroParallaxContainer({ children, className = "" }: HeroParallaxLayersProps) {
  return (
    <div className={`relative overflow-hidden select-none ${className}`}>
      {children}
    </div>
  );
}

export function HeroParallaxLayer({ 
  children, 
  speed = 0.5, 
  className = "",
}: HeroParallaxLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: layerRef,
    offset: ["start start", "end start"]
  });

  const smoothScroll = useSpring(scrollYProgress, { stiffness: 90, damping: 25, restDelta: 0.001 });
  
  const y = useTransform(smoothScroll, [0, 1], [0, speed * -100]);
  const opacity = useTransform(smoothScroll, [0, 0.85], [1, 0.3]);
  const scale = useTransform(smoothScroll, [0, 0.5], [0.98, 1]);

  return (
    <motion.div
      ref={layerRef}
      style={shouldReduceMotion ? {} : { 
        y, 
        opacity,
        scale
      }}
      className={`will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d] ${className}`}
    >
      {children}
    </motion.div>
  );
}
