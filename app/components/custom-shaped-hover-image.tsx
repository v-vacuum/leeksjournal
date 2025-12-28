// custom-shaped-hover-image.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface CustomShapedHoverImageProps {
  src: string;
  hoverSrc: string;
  alt: string;
  width?: number;
  height?: number;
  defaultMaxWidth?: string; //what does this even do?
  enableShapedHover?: boolean; //a flag for when in box/grid mode
}

export default function CustomShapedHoverImage({
  src,
  hoverSrc,
  alt,
  width,
  height,
  defaultMaxWidth = "10vw",
  enableShapedHover = true, // default: enabled
}: CustomShapedHoverImageProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // load base image for aspect ratio + transparency canvas (only if shaped hover is enabled)
  useEffect(() => {
    if (!enableShapedHover) {
      // still need aspect ratio for responsive mode
      const img = new window.Image();
      img.onload = () => setAspectRatio(img.naturalWidth / img.naturalHeight);
      img.src = src;
      return;
    }

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
  }, [src, enableShapedHover]);

  // only set up shaped hover detection if enabled
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      !enableShapedHover ||
      !canvasRef.current ||
      !containerRef.current ||
      !aspectRatio
    )
      return;

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
        setIsHovering(pixelData[3] > 30);
      }
    }
  };

  const handleMouseLeave = () => setIsHovering(false);

  // force normal image only if shaped hover is disabled
  const effectiveIsHovering = enableShapedHover ? isHovering : false;

  // Determine sizing logic:
  // - If both width and height: use both
  // - If only width: calculate height from aspect ratio
  // - If only height: calculate width from aspect ratio
  // - If neither: use default responsive sizing
  const hasBothDimensions = width && height;
  const hasOnlyWidth = width && !height;
  const hasOnlyHeight = height && !width;
  const hasNoDimensions = !width && !height;

  // If we need aspect ratio but don't have it yet, show loading state
  if ((hasOnlyWidth || hasOnlyHeight || hasNoDimensions) && !aspectRatio) {
    return (
      <div
        className="bg-gray-200 rounded-xl animate-pulse"
        style={{ maxWidth: defaultMaxWidth, aspectRatio: 1 }}
      />
    );
  }

  let displayWidth: number | undefined;
  let displayHeight: number | undefined;
  let containerStyle: React.CSSProperties;
  let useFill = false;

  if (hasBothDimensions) {
    // Use both dimensions directly
    displayWidth = width;
    displayHeight = height;
    containerStyle = { width: displayWidth, height: displayHeight };
    useFill = false;
  } else if (hasOnlyWidth && aspectRatio) {
    // Calculate height from width and aspect ratio
    displayWidth = width;
    displayHeight = Math.round(width / aspectRatio);
    containerStyle = { width: displayWidth, height: displayHeight };
    useFill = false;
  } else if (hasOnlyHeight && aspectRatio) {
    // Calculate width from height and aspect ratio
    displayHeight = height;
    displayWidth = Math.round(height * aspectRatio);
    containerStyle = { width: displayWidth, height: displayHeight };
    useFill = false;
  } else {
    // No dimensions provided - use default responsive sizing
    displayWidth = undefined;
    displayHeight = undefined;
    containerStyle = { maxWidth: defaultMaxWidth, width: "100%", aspectRatio: aspectRatio ?? undefined };
    useFill = true;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={enableShapedHover ? handleMouseMove : undefined}
      onMouseLeave={enableShapedHover ? handleMouseLeave : undefined}
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
        fill={useFill}
        sizes={
          useFill
            ? `(max-width: 768px) 90vw, ${defaultMaxWidth}`
            : undefined
        }
        style={{
          objectFit: "contain",
          transition: "opacity 0.4s ease",
          opacity: effectiveIsHovering ? 0 : 1,
        }}
        className="pointer-events-none"
      />

      {/* Hover Image - only visible if shaped hover is enabled */}
      <Image
        src={hoverSrc}
        alt={`${alt} (hover)`}
        width={displayWidth}
        height={displayHeight}
        fill={useFill}
        sizes={
          useFill
            ? `(max-width: 768px) 90vw, ${defaultMaxWidth}`
            : undefined
        }
        style={{
          objectFit: "contain",
          transition: "opacity 0.4s ease",
          opacity: effectiveIsHovering ? 1 : 0,
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
