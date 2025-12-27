"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface CustomShapedHoverImageProps {
  src: string;
  hoverSrc: string;
  alt: string;
  width?: number;
  height?: number;
  scale?: number; //eg. 1.5 = 50% bigger
  defaultMaxWidth?: string; //global defaul, eg. 70vw
}

function CustomShapedHoverImage({
  src,
  hoverSrc,
  alt,
  width,
  height,
  scale = 1,
  defaultMaxWidth = "50vw", //change this to make all images bigger or smaller by default
}: CustomShapedHoverImageProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Load the base image into a canvas to check pixel transparency
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setAspectRatio(img.naturalWidth / img.naturalHeight);

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvasRef.current = canvas;
      }
    };
    img.src = src;
  }, [src]);

  // Handle mouse movement to detect hover over non-transparent areas
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !containerRef.current || !aspectRatio) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const naturalWidth = canvasRef.current.width;
    const naturalHeight = canvasRef.current.height;

    const pixelX = Math.floor((x / rect.width) * naturalWidth);
    const pixelY = Math.floor((y / rect.height) * naturalHeight);

    if (
      pixelX >= 0 &&
      pixelX < naturalWidth &&
      pixelY >= 0 &&
      pixelY < naturalHeight
    ) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const pixelData = ctx.getImageData(pixelX, pixelY, 1, 1).data;
        setIsHovering(pixelData[3] > 20);
      }
    } else {
      setIsHovering(false);
    }
  };

  //   // Use offsetX and offsetY for accurate coordinates relative to the container
  //   const { offsetX, offsetY } = e.nativeEvent;
  //   const x = offsetX;
  //   const y = offsetY;

  //   // Get the natural dimensions of the canvas (image)
  //   const naturalWidth = canvasRef.current.width;
  //   const naturalHeight = canvasRef.current.height;

  //   // Scale the mouse coordinates to match the natural image size
  //   const pixelX = Math.floor((x / width) * naturalWidth);
  //   const pixelY = Math.floor((y / height) * naturalHeight);

  //   // Check if the pixel is within bounds and non-transparent
  //   if (
  //     pixelX >= 0 &&
  //     pixelX < naturalWidth &&
  //     pixelY >= 0 &&
  //     pixelY < naturalHeight
  //   ) {
  //     const ctx = canvasRef.current.getContext("2d");
  //     if (ctx) {
  //       const pixelData = ctx.getImageData(pixelX, pixelY, 1, 1).data;
  //       const alpha = pixelData[3]; // Alpha value (0 = transparent, 255 = opaque)
  //       setIsHovering(alpha > 0);
  //     }
  //   } else {
  //     setIsHovering(false);
  //   }
  // };

  const handleMouseLeave = () => setIsHovering(false);

  //loading placeholder
  if (!aspectRatio) {
    return (
      <div
        className="bg-gray-200 rounded-xl animate-pulse"
        style={{ maxWidth: defaultMaxWidth, aspectRatio: 1 }}
      />
    );
  }

  const hasFixedSize = width && height;
  const displayWidth = hasFixedSize ? Math.round(width * scale) : undefined;
  const displayHeight = hasFixedSize ? Math.round(height * scale) : undefined;

  const containerStyle = hasFixedSize
    ? { width: displayWidth, height: displayHeight }
    : { maxWidth: defaultMaxWidth, width: "100%", aspectRatio };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        ...containerStyle,
        margin: "auto",
      }}
      className="inline-block"
    >
      {/* Base Image */}
      <Image
        src={src}
        alt={alt}
        width={displayWidth}
        height={displayHeight}
        fill={!hasFixedSize}
        sizes={
          !hasFixedSize
            ? `(max-width: 768px) 90vw, ${defaultMaxWidth}`
            : undefined
        }
        style={{
          objectFit: "contain",
          transition: "opacity 0.4s ease", // ← smooth fade
          opacity: isHovering ? 0 : 1,
        }}
        className="pointer-events-none"
      />
      {/* Hover Image */}
      <Image
        src={hoverSrc}
        alt={`${alt} (hover)`}
        width={displayWidth}
        height={displayHeight}
        fill={!hasFixedSize}
        sizes={
          !hasFixedSize
            ? `(max-width: 768px) 90vw, ${defaultMaxWidth}`
            : undefined
        }
        style={{
          objectFit: "contain",
          transition: "opacity 0.3s ease", // smooth fade
          opacity: isHovering ? 1 : 0,
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      />{" "}
    </div>
  );
}
export default CustomShapedHoverImage;
