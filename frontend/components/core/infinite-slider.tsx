'use client';
import { cn } from '@/lib/utils';
import { useMotionValue, animate, motion, useInView } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

interface InfiniteSliderProps {
  children: React.ReactNode;
  gap?: number;
  reverse?: boolean;
  duration?: number;
  durationOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export function InfiniteSlider({
  children,
  gap = 16,
  reverse = false,
  duration = 40,
  durationOnHover,
  direction = 'horizontal',
  className,
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = useState(duration);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);
  const translation = useMotionValue(0);
  const [loopSize, setLoopSize] = useState(0);

  // Measure *one* copy of the children so we can loop exactly at that boundary
  useEffect(() => {
    if (!innerRef.current) return;

    const measure = () => {
      const el = innerRef.current;
      if (!el) return;
      if (direction === 'horizontal') {
        // The inner div has 2× content; half = one full copy
        setLoopSize(el.scrollWidth / 2);
      } else {
        setLoopSize(el.scrollHeight / 2);
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [children, direction]);

  useEffect(() => {
    if (!loopSize || !inView) return;

    // from → to = exactly one copy width, so snap back is pixel-perfect
    const from = reverse ? -loopSize : 0;
    const to = reverse ? 0 : -loopSize;

    const controls = animate(translation, [from, to], {
      ease: 'linear',
      duration: currentDuration,
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0,
    });

    return () => controls.stop();
  }, [translation, loopSize, currentDuration, reverse, inView]);

  const hoverProps = durationOnHover
    ? {
        onMouseEnter: () => setCurrentDuration(durationOnHover),
        onMouseLeave: () => setCurrentDuration(duration),
      }
    : {};

  return (
    <div
      ref={containerRef}
      className={cn('overflow-x-hidden py-4', className)}
      {...hoverProps}
    >
      <motion.div
        ref={innerRef}
        className='flex w-max'
        style={{
          x: direction === 'horizontal' ? translation : 0,
          y: direction === 'vertical' ? translation : 0,
          gap: `${gap}px`,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
