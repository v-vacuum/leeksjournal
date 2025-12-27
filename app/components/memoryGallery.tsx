// app/components/MemoryGallery.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CustomShapedHoverImage from "./custom-shaped-hover-image";
import { images } from "../data/images";
interface MemoryImage {
  id: number;
  src: string;
  hoverSrc: string;
  alt: string;
  width?: number;
  height?: number;
  scale?: number;
}

export default function MemoryGallery({ images }: { images: MemoryImage[] }) {
  const [mode, setMode] = useState<"box" | "grid">("box");

  return (
    <div className="relative min-h-screen bg-white">
      {/* Title in the center (only visible in box mode) */}
      {mode === "box" && (
        <h1
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl md:text-7xl font-bold text-[#265DB6] pointer-events-none z-10"
          style={{ fontFamily: "'Inria Serif', serif" }}
        >
          vivi’s memory box
        </h1>
      )}

      {/* Mode Toggle Buttons */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 flex gap-4">
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

      {/* Images Container */}
      <div
        className={
          mode === "grid"
            ? "pt-32 px-8" // padding to make room for buttons/title
            : "relative w-full h-screen"
        }
        style={
          mode === "grid"
            ? {
                display: "flex",
                flexWrap: "wrap",
                columnGap: "24px",
                rowGap: "150px", // spacing between images
                justifyContent: "center",
                alignContent: "flex-start",
              }
            : undefined
        }
      >
        {images.map((img, index) => {
          // Calculate position in the ring
          const angle = (index / images.length) * 2 * Math.PI - Math.PI / 2; // Start from top
          const x = 600 * Math.cos(angle);
          const y = 400 * Math.sin(angle);

          return (
            <motion.div
              key={img.id}
              layout // This magic prop enables smooth animation between layouts
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 35,
              }}
              style={
                mode === "box"
                  ? {
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      x: `${x}px`,
                      y: `${y}px`,
                      translateX: "-50%",
                      translateY: "-50%",
                    }
                  : { position: "static", transform: "none" }
              }
              whileHover={mode === "box" ? { rotate: 10 } : {}}
              className="cursor-pointer"
            >
              <CustomShapedHoverImage
                src={img.src}
                hoverSrc={img.hoverSrc}
                alt={img.alt}
                width={img.width}
                height={img.height}
                scale={img.scale ?? 1}
                defaultMaxWidth="60vw"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
