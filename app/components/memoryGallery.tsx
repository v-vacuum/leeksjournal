"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import CustomShapedHoverImage from "./custom-shaped-hover-image";

interface MemoryImage {
  id: number;
  src: string;
  hoverSrc: string;
  alt: string;
  width?: number;
  height?: number;
}

const BOX_RADIUS_X = 500;
const BOX_RADIUS_Y = 290;
const ROTATION_RANGE = 60;
const TRANSITION_DELAY = 500;

const TITLE_TRANSITION = { duration: 0.2 };
const GRID_TRANSITION = { duration: 0.3 };

export default function MemoryGallery({ images }: { images: MemoryImage[] }) {
  const [mode, setMode] = useState<"box" | "grid">("box");
  const [transitioning, setTransitioning] = useState(false);

  const imagePositions = useMemo(() => {
    return images.map((_, i) => {
      const angle = (i / images.length) * 2 * Math.PI - Math.PI / 2;
      const randomRotation =
        Math.random() * ROTATION_RANGE - ROTATION_RANGE / 2;
      return {
        x: BOX_RADIUS_X * Math.cos(angle),
        y: BOX_RADIUS_Y * Math.sin(angle),
        rotation: randomRotation,
      };
    });
  }, [images.length]);

  const handleModeSwitch = useCallback(
    async (newMode: "box" | "grid") => {
      if (newMode === mode || transitioning) return;

      setTransitioning(true);
      await new Promise((resolve) => setTimeout(resolve, TRANSITION_DELAY));
      setMode(newMode);
      await new Promise((resolve) => setTimeout(resolve, 50));
      setTransitioning(false);
    },
    [mode, transitioning],
  );

  return (
    <div
      className="relative min-h-screen bg-[#f9f9f9]"
      style={{ scrollbarGutter: "stable", overflowY: "scroll" }}
    >
      {/* Title */}
      <AnimatePresence mode="wait">
        {!transitioning && mode === "box" && (
          <motion.h1
            key="box-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TITLE_TRANSITION}
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2
            text-6xl md:text-6xl font-bold text-[#265DB6] pointer-events-none z-50 select-none text-center"
            style={{
              fontFamily: "'Inria Serif', serif",
              top: "48%",
            }}
          >
            <div>vivi&apos;s</div>
            <div>memory box</div>
          </motion.h1>
        )}

        {!transitioning && mode === "grid" && (
          <motion.h1
            key="grid-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl md:text-5xl font-bold text-[#265DB6] pointer-events-none z-40 select-none text-center sticky top-[75px] md:top-[65px]"
            style={{
              fontFamily: "'Inria Serif', serif",
              top: "65px",
            }}
          >
            <div>vivi&apos;s memory box</div>
          </motion.h1>
        )}
      </AnimatePresence>

      {/* Toggle Buttons */}
      <div className="sticky z-50 flex justify-center" style={{ top: "130px" }}>
        <div className="flex gap-4">
          {[
            {
              mode: "box" as const,
              icon: "/boxMode.svg",
              label: "in the box view",
            },
            {
              mode: "grid" as const,
              icon: "/gridMode.svg",
              label: "grid view",
            },
          ].map(({ mode: btnMode, icon, label }) => (
            <button
              key={btnMode}
              onClick={() => handleModeSwitch(btnMode)}
              disabled={transitioning}
              className="group relative w-12 h-12 rounded-lg transition-transform hover:scale-105 disabled:opacity-50"
              style={{
                backgroundColor: mode === btnMode ? "#E7E8EA" : "#F9F9F9",
                border: "1.5px solid #E7E8EA",
              }}
            >
              <Image
                src={icon}
                alt={`${btnMode} Mode`}
                width={24}
                height={24}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
              <span
                className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0
                group-hover:opacity-100 transition-opacity text-[#265DB6] text-sm font-medium
                pointer-events-none px-3 py-1"
                style={{
                  fontFamily: "'Inria Serif', serif",
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #E7E8EA",
                  borderRadius: "8px",
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Box Mode */}
      {mode === "box" && (
        <div className="fixed inset-0">
          {images.map((img, i) => {
            const { x, y, rotation } = imagePositions[i];
            const finalX = transitioning ? 0 : x;
            const finalY = transitioning ? 0 : y;

            return (
              <motion.div
                key={img.id}
                animate={{
                  x: finalX,
                  y: finalY,
                  rotate: transitioning ? 0 : rotation,
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                }}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  translateX: "-50%",
                  translateY: "-50%",
                }}
                whileHover={!transitioning ? { rotate: 8 } : {}}
              >
                <CustomShapedHoverImage
                  src={img.src}
                  hoverSrc={img.hoverSrc}
                  alt={img.alt}
                  width={img.width ? img.width * 0.7 : undefined}
                  height={img.height ? img.height * 0.7 : undefined}
                  defaultMaxWidth="50vw"
                  enableShapedHover={false}
                />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Grid Mode */}
      <AnimatePresence>
        {mode === "grid" && !transitioning && (
          <motion.div
            key="grid-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={GRID_TRANSITION}
            className="pt-[120px] px-8 pb-32"
          >
            <div className="flex flex-wrap justify-center gap-x-[60px] gap-y-[80px]">
              {images.map((img, index) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.3 + index * 0.04, // Added base delay
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  className="cursor-pointer"
                >
                  <CustomShapedHoverImage
                    src={img.src}
                    hoverSrc={img.hoverSrc}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    defaultMaxWidth="420px"
                    enableShapedHover={!transitioning}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
