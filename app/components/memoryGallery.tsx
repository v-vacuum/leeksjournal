// app/components/MemoryGallery.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CustomShapedHoverImage from "./custom-shaped-hover-image";

interface MemoryImage {
  id: number;
  src: string;
  hoverSrc: string;
  alt: string;
  width?: number;
  height?: number;
}

export default function MemoryGallery({ images }: { images: MemoryImage[] }) {
  const [mode, setMode] = useState<"box" | "grid">("box"); // start in box to test easily

  return (
    <div className="relative min-h-screen bg-white">
      {/* Title - only visible in box mode */}
      {mode === "box" && (
        <h1
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl md:text-7xl font-bold text-[#265DB6] pointer-events-none z-50 select-none"
          style={{ fontFamily: "'Inria Serif', serif" }}
        >
          vivi’s memory box
        </h1>
      )}

      {/* Mode Toggle Buttons */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex gap-4">
        <button
          onClick={() => setMode("box")}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            mode === "box"
              ? "bg-[#265DB6] text-white"
              : "bg-white text-[#265DB6] border-2 border-[#265DB6]"
          }`}
          style={{ fontFamily: "'Inria Serif', serif" }}
        >
          Box Mode
        </button>
        <button
          onClick={() => setMode("grid")}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            mode === "grid"
              ? "bg-[#265DB6] text-white"
              : "bg-white text-[#265DB6] border-2 border-[#265DB6]"
          }`}
          style={{ fontFamily: "'Inria Serif', serif" }}
        >
          Grid Mode
        </button>
      </div>

      {/* === BOX MODE: Dedicated full-screen container === */}
      {mode === "box" && (
        <div className="fixed inset-0 pointer-events-none">
          {images.map((img, index) => {
            const angle = (index / images.length) * 2 * Math.PI - Math.PI / 2;
            const x = 600 * Math.cos(angle);
            const y = 450 * Math.sin(angle);

            return (
              <motion.div
                key={img.id}
                layout
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 35,
                }}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  x: `${x}px`,
                  y: `${y}px`,
                  translateX: "-50%",
                  translateY: "-50%",
                }}
                whileHover={{ rotate: 8 }}
                className="pointer-events-auto" // allow hover on images
              >
                <CustomShapedHoverImage
                  src={img.src}
                  hoverSrc={img.hoverSrc}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  defaultMaxWidth="50vw"
                  enableShapedHover={false} // no shaped hover in box mode
                />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* === GRID MODE: Flex-wrap gallery === */}
      {mode === "grid" && (
        <div
          className="pt-32 px-8"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignContent: "flex-start",
            columnGap: "60px",
            rowGap: "80px",
          }}
        >
          {images.map((img) => (
            <motion.div
              key={img.id}
              layout
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 35,
              }}
              style={{
                position: "static",
                transform: "none",
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
                enableShapedHover={true} // full shaped hover in grid mode
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
