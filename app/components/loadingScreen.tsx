"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function LoadingScreen({ onLoaded }: { onLoaded: () => void }) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Simulate load complete after images preloaded (or use real Image onload)
  useEffect(() => {
    const timer = setTimeout(() => onLoaded(), 3000); // Replace with real preload logic
    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        fontFamily: "'Inria Serif', serif",
        fontSize: "3rem",
        color: "#265DB6",
      }}
    >
      <h1>vivi's looking for the right box</h1>
      <p style={{ fontSize: "4rem", marginTop: "1rem" }}>{dots}</p>
    </motion.div>
  );
}
