import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface BentoStaggeredGridProps {
  children: React.ReactNode;
  className?: string;
}

interface BentoStaggeredCardProps {
  children: React.ReactNode;
  index?: number;
  colSpan?: string; // e.g. "md:col-span-8" or "md:col-span-4"
  className?: string;
  staggerDelay?: number;
}

export function BentoStaggeredGrid({ children, className = "" }: BentoStaggeredGridProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cards = e.currentTarget.getElementsByClassName('spotlight-card');
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
      (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
    }
  };

  return (
    <div 
      onMouseMove={handleMouseMove} 
      className={`grid grid-cols-1 md:grid-cols-12 gap-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function BentoStaggeredCard({
  children,
  index = 0,
  colSpan = "md:col-span-4",
  className = "",
  staggerDelay = 0.08,
}: BentoStaggeredCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.015 }}
      transition={{ 
        duration: 0.45, 
        delay: index * staggerDelay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={`${colSpan} bg-white dark:bg-[#1C1B19] border border-[#E6E5E0] dark:border-[#2E2D2A] p-8 rounded-[2rem] shadow-sm ballpark-shadow transition-colors duration-300 spotlight-card flex flex-col justify-between overflow-hidden relative cursor-default ${className}`}
    >
      {children}
    </motion.div>
  );
}
