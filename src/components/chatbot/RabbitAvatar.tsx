"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type RabbitMood = "idle" | "thinking" | "talking" | "happy";

const FRAMES = {
  idle: "/chatbot/rabbit-idle.png",
  wink: "/chatbot/rabbit-wink.png",
  happy: "/chatbot/rabbit-happy.png",
  blink: "/chatbot/rabbit-blink.png",
  sleepy: "/chatbot/rabbit-sleepy.png",
  talk: "/chatbot/rabbit-talk.png",
} as const;

type Props = {
  mood?: RabbitMood;
  size?: number;
  className?: string;
  priority?: boolean;
  /** 親側で位置アニメする場合は内部の浮遊を止める */
  animateFloat?: boolean;
};

export function RabbitAvatar({
  mood = "idle",
  size = 112,
  className,
  priority = false,
  animateFloat = true,
}: Props) {
  const [frame, setFrame] = useState<keyof typeof FRAMES>("idle");

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const schedule = (ms: number, next: () => void) => {
      timer = setTimeout(() => {
        if (!cancelled) next();
      }, ms);
    };

    const clear = () => {
      if (timer) clearTimeout(timer);
    };

    if (mood === "thinking") {
      setFrame("sleepy");
      const loop = () => {
        setFrame((prev) => (prev === "sleepy" ? "blink" : "sleepy"));
        schedule(700, loop);
      };
      schedule(700, loop);
      return () => {
        cancelled = true;
        clear();
      };
    }

    if (mood === "talking") {
      setFrame("talk");
      const loop = () => {
        setFrame((prev) => (prev === "talk" ? "happy" : "talk"));
        schedule(280, loop);
      };
      schedule(280, loop);
      return () => {
        cancelled = true;
        clear();
      };
    }

    if (mood === "happy") {
      setFrame("happy");
      const t1 = setTimeout(() => {
        if (!cancelled) setFrame("wink");
      }, 900);
      const t2 = setTimeout(() => {
        if (!cancelled) setFrame("idle");
      }, 1600);
      return () => {
        cancelled = true;
        clearTimeout(t1);
        clearTimeout(t2);
        clear();
      };
    }

    setFrame("idle");
    const idleLoop = () => {
      const roll = Math.random();
      if (roll < 0.5) {
        setFrame("blink");
        schedule(160, () => {
          setFrame("idle");
          schedule(1800 + Math.random() * 2200, idleLoop);
        });
      } else if (roll < 0.78) {
        setFrame("wink");
        schedule(420, () => {
          setFrame("idle");
          schedule(2000 + Math.random() * 2400, idleLoop);
        });
      } else {
        setFrame("happy");
        schedule(500, () => {
          setFrame("idle");
          schedule(2200 + Math.random() * 2600, idleLoop);
        });
      }
    };
    schedule(1600 + Math.random() * 1200, idleLoop);

    return () => {
      cancelled = true;
      clear();
    };
  }, [mood]);

  return (
    <motion.div
      className={cn("relative select-none", className)}
      style={{ width: size, height: size }}
      animate={
        animateFloat
          ? mood === "thinking"
            ? { y: [0, -4, 0], rotate: [-2, 2, -2] }
            : mood === "talking"
              ? { y: [0, -6, 0], scale: [1, 1.04, 1] }
              : { y: [0, -8, 0] }
          : undefined
      }
      transition={
        animateFloat
          ? {
              duration: mood === "talking" ? 0.55 : mood === "thinking" ? 1.4 : 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : undefined
      }
    >
      <Image
        src={FRAMES[frame]}
        alt="くろうさ"
        width={size * 2}
        height={size * 2}
        className="relative h-full w-full object-contain"
        draggable={false}
        priority={priority}
        unoptimized
      />
    </motion.div>
  );
}
