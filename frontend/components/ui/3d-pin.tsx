"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  title?: string;
  href?: string;
  className?: string;
  containerClassName?: string;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn(
        "relative group/pin z-50 cursor-pointer",
        containerClassName
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/*
       * The 3D perspective wrapper. We tilt the entire container on the X axis
       * so the card appears to recede into space on hover.
       */}
      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          style={{
            transform: hovered
              ? "translate(-50%,-50%) rotateX(40deg) scale(0.82)"
              : "translate(-50%,-50%) rotateX(0deg) scale(1)",
            transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
          className={cn(
            "absolute left-1/2 p-4 top-1/2 flex justify-start items-start rounded-2xl",
            "shadow-[0_16px_40px_rgba(0,0,0,0.5)]",
            "bg-white dark:bg-[#0C0C0C]",
            "border border-stone-200 dark:border-white/[0.08]",
            "group-hover/pin:border-amber-500/30 dark:group-hover/pin:border-amber-500/20",
            "transition-[border-color,box-shadow] duration-500",
            "group-hover/pin:shadow-[0_16px_60px_rgba(245,158,11,0.12)]",
            "overflow-hidden"
          )}
        >
          <div className={cn("relative z-50", className)}>{children}</div>
        </div>
      </div>

      {/* Perspective effects rendered on hover */}
      <PinPerspective title={title} href={href} />
    </div>
  );
};

export const PinPerspective = ({
  title,
  href,
}: {
  title?: string;
  href?: string;
}) => {
  return (
    <motion.div
      className="pointer-events-none w-full h-80 flex items-center justify-center opacity-0 group-hover/pin:opacity-100 z-[60] transition-opacity duration-500"
    >
      <div className="w-full h-full -mt-7 flex-none inset-0 relative">

        {/* ─── Clickable URL Pill ─────────────────────────────────── */}
        <div className="absolute top-0 inset-x-0 flex justify-center z-20">
          <a
            href={href || '#'}
            className="pointer-events-auto relative flex items-center gap-2 z-10 rounded-full bg-[#0a0a0a] py-1.5 px-5 ring-1 ring-white/[0.12] shadow-xl hover:ring-amber-500/40 hover:bg-[#111] transition-all duration-300 group/pill"
          >
            {/* Title — clean, no dot, no wrapping */}
            <span className="relative z-20 text-white text-[11px] font-semibold tracking-wide py-0.5 whitespace-nowrap group-hover/pill:text-amber-300 transition-colors duration-200">
              {title}
            </span>
            {/* Arrow slides in on hover */}
            <svg className="w-3 h-3 text-amber-500 opacity-0 group-hover/pill:opacity-100 -translate-x-1 group-hover/pill:translate-x-0 transition-all duration-200" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
            {/* Amber underline gradient */}
            <span className="absolute -bottom-px left-5 right-5 h-px bg-gradient-to-r from-amber-500/0 via-amber-400/70 to-amber-500/0" />
          </a>
        </div>

        {/* ─── Animated Radar Rings (perspective plane) ─────────── */}
        <div
          style={{
            perspective: "1000px",
            transform: "rotateX(70deg) translateZ(0)",
          }}
          className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
        >
          {[0, 2, 4].map((delay, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
              animate={{ opacity: [0, 0.8, 0.4, 0], scale: [0, 1.2, 1.5, 1.8], z: 0 }}
              transition={{ duration: 4.5, repeat: Infinity, delay, ease: "easeOut" }}
              className={cn(
                "absolute left-1/2 top-1/2 rounded-full",
                "h-[14rem] w-[14rem]",
                idx === 0
                  ? "bg-amber-500/[0.07] shadow-[0_0_40px_rgba(245,158,11,0.15)]"
                  : idx === 1
                  ? "bg-amber-400/[0.05] shadow-[0_0_30px_rgba(245,158,11,0.10)]"
                  : "bg-amber-300/[0.04]"
              )}
            />
          ))}
        </div>

        {/* ─── Pin Beam ─────────────────────────────────────────── */}
        <>
          {/* Glowing blur beam */}
          <motion.div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent to-amber-500 translate-y-[14px] w-[2px] h-24 group-hover/pin:h-48 blur-[3px] transition-all duration-700" />
          {/* Sharp core beam */}
          <motion.div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent via-amber-400 to-amber-500 translate-y-[14px] w-px h-24 group-hover/pin:h-48 transition-all duration-700" />
          {/* Glow dot — outer */}
          <motion.div className="absolute right-1/2 translate-x-[2px] bottom-1/2 bg-amber-500 translate-y-[14px] w-[6px] h-[6px] rounded-full z-40 blur-[4px]" />
          {/* Crisp dot — inner */}
          <motion.div className="absolute right-1/2 translate-x-[0.5px] bottom-1/2 bg-amber-200 translate-y-[14px] w-[2px] h-[2px] rounded-full z-40" />
        </>
      </div>
    </motion.div>
  );
};
