"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { useSpring } from "react-spring";

import { cn } from "@/lib/utils";

export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [error, setError] = useState(false);
  
  const [{ r }, api] = useSpring(() => ({
    r: 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 40,
      precision: 0.001,
    },
  }));

  useEffect(() => {
    let phi = 0;
    let globe: any;
    let currentWidth = 0;

    const onResize = () => {
      if (canvasRef.current) {
        currentWidth = canvasRef.current.offsetWidth;
      }
    };

    const initialize = () => {
      if (!canvasRef.current || globe) return;
      
      const canvas = canvasRef.current;
      currentWidth = canvas.offsetWidth;
      
      if (currentWidth <= 0) return;

      // Extreme safety check for WebGL
      try {
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) {
          setError(true);
          return;
        }
        if (!gl.getExtension("OES_standard_derivatives")) {
          setError(true);
          return;
        }
      } catch (e) {
        setError(true);
        return;
      }

      try {
        globe = createGlobe(canvas, {
          devicePixelRatio: 2,
          width: currentWidth * 2,
          height: currentWidth * 2,
          phi: 0,
          theta: 0,
          dark: 0,
          diffuse: 1.5,
          mapSamples: 16000,
          mapBrightness: 10,
          baseColor: [1, 0.98, 0.95],
          markerColor: [245 / 255, 158 / 255, 11 / 255],
          glowColor: [255 / 255, 230 / 255, 200 / 255],
          markers: [
            { location: [37.7595, -122.4367], size: 0.03 },
            { location: [40.7128, -74.006], size: 0.1 },
            { location: [51.5074, -0.1278], size: 0.1 },
            { location: [25.2048, 55.2708], size: 0.1 },
          ],
          onRender: (state) => {
            if (!pointerInteracting.current) {
              phi += 0.003;
            }
            state.phi = phi + r.get();
            state.width = currentWidth * 2;
            state.height = currentWidth * 2;
          },
        });

        setTimeout(() => {
          if (canvasRef.current) {
            canvasRef.current.style.opacity = "1";
          }
        });
      } catch (e) {
        console.error("Globe failed to initialize:", e);
        setError(true);
      }
    };

    window.addEventListener("resize", onResize);
    
    // Use a small delay to ensure layout is ready
    const timer = setTimeout(initialize, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      if (globe) {
        globe.destroy();
      }
    };
  }, []); // Only run once to prevent context collisions

  if (error) {
    return (
        <div className={cn("absolute inset-0 flex items-center justify-center bg-amber-500/5 rounded-full", className)}>
            {/* Minimal fallback or nothing */}
        </div>
    );
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-[-150px] mx-auto aspect-square h-[600px] w-[600px] [mask-image:radial-gradient(circle_at_50%_50%,white_0%,transparent_70%)]",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({
              r: delta / 200,
            });
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({
              r: delta / 100,
            });
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 1.5s ease",
        }}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}
