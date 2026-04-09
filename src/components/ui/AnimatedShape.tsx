"use client";

import { motion } from "framer-motion";

interface AnimatedShapeProps {
  className?: string;
  delay?: number;
  width?: string;
  height?: string;
}

export function AnimatedShape({ className, delay = 0, width = "w-64", height = "h-64" }: AnimatedShapeProps) {
  return (
    <motion.div
      animate={{
        borderRadius: [
          "60% 40% 30% 70% / 60% 30% 70% 40%",
          "30% 60% 70% 40% / 50% 60% 30% 60%",
          "60% 40% 30% 70% / 60% 30% 70% 40%",
        ],
        rotate: [0, 10, -10, 0],
      }}
      transition={{ duration: 11.5, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute ${width} ${height} opacity-40 backdrop-blur-sm z-0 pointer-events-none ${className}`}
    />
  );
}
