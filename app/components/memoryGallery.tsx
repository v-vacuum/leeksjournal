// app/components/MemoryGallery.tsx
"use client";

import { useState, useEffect, useRef } from "react";
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
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [gridPositions, setGridPositions] = useState<{ x: number; y: number }[]>([]);

  // Measure grid positions when in grid mode
  useEffect(() => {
    if (mode === "grid" && gridContainerRef.current) {
      // Small delay to ensure layout is complete
      const timer = setTimeout(() => {
        const container = gridContainerRef.current;
        if (!container) return;

        const items = container.querySelectorAll('[data-grid-item]');
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;
        const positions: { x: number; y: number }[] = [];

        items.forEach((item) => {
          const rect = item.getBoundingClientRect();
          const itemCenterX = rect.left + rect.width / 2;
          const itemCenterY = rect.top + rect.height / 2;
          
          positions.push({
            x: itemCenterX - viewportCenterX,
            y: itemCenterY - viewportCenterY,
          });
        });

        setGridPositions(positions);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [mode]);

  const handleModeSwitch = async (newMode: "box" | "grid") => {
    if (newMode === mode || transitioning) return;
    
    setTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setMode(newMode);
    await new Promise(resolve => setTimeout(resolve, 50));
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

      {/* Box Mode */}
      {mode === "box" && (
        <div className="fixed inset-0">
          {images.map((img, i) => {
            const angle = (i / images.length) * 2 * Math.PI - Math.PI / 2;
            const finalX = transitioning ? 0 : 600 * Math.cos(angle);
            const finalY = transitioning ? 0 : 300 * Math.sin(angle);

            return (
              <motion.div
                key={img.id}
                animate={{ x: finalX, y: finalY }}
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
      {mode === "grid" && (
        <>
          {/* Invisible grid for position measurement */}
          <div 
            ref={gridContainerRef}
            className="pt-32 px-8 flex flex-wrap justify-center gap-x-[60px] gap-y-[80px] pointer-events-none opacity-0"
            style={{ position: "absolute", top: 0, left: 0, right: 0 }}
          >
            {images.map((img) => (
              <div key={`measure-${img.id}`} data-grid-item>
                <CustomShapedHoverImage
                  src={img.src}
                  hoverSrc={img.hoverSrc}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  defaultMaxWidth="420px"
                  enableShapedHover={false}
                />
              </div>
            ))}
          </div>

          {/* Animated images */}
          <div className="fixed inset-0">
            {images.map((img, i) => {
              const finalX = transitioning || !gridPositions[i] ? 0 : gridPositions[i].x;
              const finalY = transitioning || !gridPositions[i] ? 0 : gridPositions[i].y;

              return (
                <motion.div
                  key={img.id}
                  animate={{ x: finalX, y: finalY }}
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
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}