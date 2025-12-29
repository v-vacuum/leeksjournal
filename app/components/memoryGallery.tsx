// app/components/MemoryGallery.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

export default function MemoryGallery({ images }: { images: MemoryImage[] }) {
  const [mode, setMode] = useState<"box" | "grid">("box");
  const [transitioning, setTransitioning] = useState(false);

  const handleModeSwitch = async (newMode: "box" | "grid") => {
    if (newMode === mode || transitioning) return;
    
    setTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setMode(newMode);
    await new Promise(resolve => setTimeout(resolve, 100));
    setTransitioning(false);
  };

  return (
    <div className="relative min-h-screen bg-[#f9f9f9]">
      {/* Title */}
      {mode === "box" && !transitioning && (
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 
          text-6xl md:text-7xl font-bold text-[#265DB6] pointer-events-none z-50 select-none text-center"
          style={{ fontFamily: "'Inria Serif', serif" }}
        >
          <div>vivi's</div>
          <div>memory box</div>
        </motion.h1>
      )}

      {/* Toggle Buttons */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex gap-4">
        <button
          onClick={() => handleModeSwitch("box")}
          disabled={transitioning}
          className="group relative w-12 h-12 rounded-lg transition-transform hover:scale-105 disabled:opacity-50"
          style={{
            backgroundColor: mode === "box" ? "#E7E8EA" : "#F9F9F9",
            border: "1px solid #E7E8EA",
          }}
        >
          <Image
            src="/boxMode.svg"
            alt="Box Mode"
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
            in the box view
          </span>
        </button>
        <button
          onClick={() => handleModeSwitch("grid")}
          disabled={transitioning}
          className="group relative w-12 h-12 rounded-lg transition-transform hover:scale-105 disabled:opacity-50"
          style={{
            backgroundColor: mode === "grid" ? "#E7E8EA" : "#F9F9F9",
            border: "1px solid #E7E8EA",
          }}
        >
          <Image
            src="/gridMode.svg"
            alt="Grid Mode"
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
            grid view
          </span>
        </button>
      </div>

      {/* Images Container */}
      <div className={mode === "box" ? "fixed inset-0" : "pt-32 px-8"}>
        <div
          className={mode === "grid" ? "flex flex-wrap justify-center gap-x-[60px] gap-y-[80px]" : ""}
          style={mode === "box" ? { position: "relative", width: "100%", height: "100%" } : {}}
        >
          {images.map((img, i) => {
            let finalX = 0;
            let finalY = 0;

            if (mode === "box" && !transitioning) {
              const angle = (i / images.length) * 2 * Math.PI - Math.PI / 2;
              finalX = 600 * Math.cos(angle);
              finalY = 300 * Math.sin(angle);
            }

            return (
              <motion.div
                key={img.id}
                animate={{
                  x: mode === "box" ? finalX : 0,
                  y: mode === "box" ? finalY : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                }}
                style={
                  mode === "box"
                    ? {
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        translateX: "-50%",
                        translateY: "-50%",
                      }
                    : {}
                }
                whileHover={!transitioning && mode === "box" ? { rotate: 8 } : {}}
                className={mode === "grid" ? "cursor-pointer" : ""}
              >
                <CustomShapedHoverImage
                  src={img.src}
                  hoverSrc={img.hoverSrc}
                  alt={img.alt}
                  width={mode === "box" && img.width ? img.width * 0.7 : img.width}
                  height={mode === "box" && img.height ? img.height * 0.7 : img.height}
                  defaultMaxWidth={mode === "box" ? "50vw" : "420px"}
                  enableShapedHover={mode === "grid" && !transitioning}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}